import { PrismaClient, descriptive_questions } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

// temporary solution for retrieving the questions
////////////////////////////////////////////
interface DescriptivePrompt {
  question: string // the question to display on the UI for this property
  default: string // default value of the field
  value: keyof descriptive_questions // property of descriptive question from database
}

const descriptive_prompts: DescriptivePrompt[] = [
  {
    question: 'For what purpose was the dataset created?',
    default: 'N/A',
    value: 'purpose',
  },
  {
    question: 'Who funded the creation of the dataset?',
    default: 'N/A',
    value: 'funding',
  },
  {
    question: 'What do the instances that comprise the dataset represent?',
    default: 'N/A',
    value: 'represent',
  },
  {
    question: 'Are there recommended data splits?',
    default: 'N/A',
    value: 'dataSplits',
  },
  {
    question: 'Does the dataset contain data that might be considered sensitive in any way?',
    default: 'N/A',
    value: 'sensitiveInfo',
  },
  {
    question: 'Was there any data preprocessing performed?',
    default: 'N/A',
    value: 'preprocessingDescription',
  },
  {
    question: 'Has the dataset been used for any tasks already?',
    default: 'N/A',
    value: 'used',
  },
  { question: 'Additional Information', default: 'N/A', value: 'otherInfo' },
  {
    question: 'Citation Requests/Acknowledgements',
    default: 'N/A',
    value: 'datasetCitation',
  },
]

class DescriptiveService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // given a dataset ID, return an object of descriptive questions
  ////////////////////////////////////////////
  async getDescriptive(input: number) {
    const dataset = await this.prisma.donated_datasets.findFirst({
      where: { ID: input },
      select: {
        descriptive_questions: true,
      },
    })
    return dataset?.descriptive_questions
  }

  // given a dataset ID, return an array of question/answer tuples
  ////////////////////////////////////////////
  async getDescriptiveQA(input: number) {
    const dataset = await this.prisma.donated_datasets.findFirst({
      where: { ID: input },
      select: {
        descriptive_questions: true,
        tabular: true,
      },
    })

    if (!dataset || !dataset.descriptive_questions) {
      return
    }

    const { descriptive_questions } = dataset

    // append an extra entry just for missing values
    const tabularMissing: [string, string | number | null][] = dataset?.tabular?.missingValues
      ? [['Has Missing Values', 'Symbol: ' + dataset.tabular.missingValues]]
      : []

    const qa_array: [string, string | number | null][] = descriptive_prompts
      .filter(
        (item) =>
          // a big chain of checks to make TypeScript happy
          Object.keys(descriptive_questions).length &&
          descriptive_questions[item.value] !== '' &&
          descriptive_questions[item.value] !== null &&
          descriptive_questions[item.value] !== item.default
      )
      .map((item) => {
        // each descriptive question and corresponding answer is a tuple in an array
        const answer = descriptive_questions[item.value]
        return [item.question, answer] as [string, string | number | null]
      })
      .concat(tabularMissing) // append the info for missing values

    return qa_array
  }
}

export default DescriptiveService
