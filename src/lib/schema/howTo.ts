export interface HowToStep {
  title: string;
  text: string;
}

export interface HowToSchemaInput {
  name: string;
  description: string;
  steps: HowToStep[];
}

export function generateHowToSchema(input: HowToSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    step: input.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  };
}
