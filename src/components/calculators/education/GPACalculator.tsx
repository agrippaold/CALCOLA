import { useState } from 'preact/hooks';
import { calculateGPA } from '../../../lib/formulas/text';
import CalculatorShell from '../base/CalculatorShell';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

interface Course {
  id: number;
  grade: string;
  credits: string;
}

const GRADES = [
  { value: 'A+', label: 'A+ (4.0)' },
  { value: 'A', label: 'A (4.0)' },
  { value: 'A-', label: 'A- (3.7)' },
  { value: 'B+', label: 'B+ (3.3)' },
  { value: 'B', label: 'B (3.0)' },
  { value: 'B-', label: 'B- (2.7)' },
  { value: 'C+', label: 'C+ (2.3)' },
  { value: 'C', label: 'C (2.0)' },
  { value: 'C-', label: 'C- (1.7)' },
  { value: 'D+', label: 'D+ (1.3)' },
  { value: 'D', label: 'D (1.0)' },
  { value: 'D-', label: 'D- (0.7)' },
  { value: 'F', label: 'F (0.0)' },
];

const CREDIT_OPTIONS = [
  { value: '1', label: '1 credit' },
  { value: '2', label: '2 credits' },
  { value: '3', label: '3 credits' },
  { value: '4', label: '4 credits' },
  { value: '5', label: '5 credits' },
];

let nextId = 1;

export default function GPACalculator({ defaults, lang }: Props) {
  const [courses, setCourses] = useState<Course[]>([
    { id: nextId++, grade: 'A', credits: '3' },
    { id: nextId++, grade: 'B', credits: '3' },
    { id: nextId++, grade: 'A-', credits: '4' },
    { id: nextId++, grade: 'B+', credits: '3' },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: nextId++, grade: 'A', credits: '3' }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: 'grade' | 'credits', value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const validCourses = courses
    .filter(c => c.grade && parseInt(c.credits) > 0)
    .map(c => ({ grade: c.grade, credits: parseInt(c.credits) }));

  const result = validCourses.length > 0 ? calculateGPA(validCourses) : null;

  const gpaColor = result
    ? result.gpa >= 3.5 ? 'text-green-600'
      : result.gpa >= 3.0 ? 'text-blue-600'
      : result.gpa >= 2.0 ? 'text-yellow-600'
      : 'text-red-600'
    : '';

  return (
    <CalculatorShell>
      <div class="space-y-3">
        {courses.map((course, i) => (
          <div key={course.id} class="flex items-end gap-2">
            <div class="text-sm text-gray-500 w-6 pb-2">{i + 1}.</div>
            <div class="flex-1">
              <SelectField
                label={i === 0 ? 'Grade' : ''}
                value={course.grade}
                onChange={(v) => updateCourse(course.id, 'grade', v)}
                options={GRADES}
              />
            </div>
            <div class="w-28">
              <SelectField
                label={i === 0 ? 'Credits' : ''}
                value={course.credits}
                onChange={(v) => updateCourse(course.id, 'credits', v)}
                options={CREDIT_OPTIONS}
              />
            </div>
            <button
              onClick={() => removeCourse(course.id)}
              class="pb-2 text-gray-400 hover:text-red-500 transition-colors"
              disabled={courses.length <= 1}
              aria-label="Remove course"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addCourse}
        class="mt-3 px-4 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Course
      </button>

      {result && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'GPA', value: result.gpa.toFixed(2), highlight: true },
              { label: 'Total Credits', value: result.totalCredits.toString() },
              { label: 'Total Grade Points', value: result.totalPoints.toFixed(1) },
              { label: 'Courses', value: validCourses.length.toString() },
            ]}
          />

          {/* GPA scale bar */}
          <div class="mt-4">
            <div class="bg-gray-200 rounded-full h-3 overflow-hidden relative">
              <div
                class="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-green-500"
                style={{ width: '100%' }}
              />
              <div
                class="absolute top-0 h-full w-1 bg-gray-800 rounded"
                style={{ left: `${(result.gpa / 4.0) * 100}%` }}
              />
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.0</span>
              <span>1.0</span>
              <span>2.0</span>
              <span>3.0</span>
              <span>4.0</span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
