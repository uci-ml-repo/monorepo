import { writable } from 'svelte/store'

import type {
  BasicInfoFormData,
  TabularFormData,
  DescriptiveFormData,
  DonationFormData,
} from '$lib/schemas/Donation'

const currentUser = {
  firstName: 'Elysia',
  lastName: 'Ego',
  email: null,
  address: 'Elysian Realm',
  institution: 'Flamechasers',
}

function createDonationFormData() {
  const { subscribe, update } = writable<DonationFormData>({
    metadata: {
      Name: '',
      Abstract: '',
      Types: [],
      Task: [],
      Area: '',
      DOI: null,
    },
    creator: currentUser,
    keywords: [],
    creators: [],

    // part 2
    tabular: {
      missingValues: null,
    },

    files: {
      supplemental: null,
      testData: null,
      csv: null,
    },

    Graphics: null,

    attributes: [],

    // part 3
    descriptive: {
      purpose: null,
      funding: null,
      represent: null,
      dataSplits: null,
      sensitiveInfo: null,
      preprocessingDescription: null,
      used: null,
      otherInfo: null,
      datasetCitation: null,
    },
  })

  return {
    subscribe,
    update: (formData: BasicInfoFormData | TabularFormData | DescriptiveFormData) =>
      update((allFormData) => ({ ...allFormData, ...formData })),

    // a subset of all the form data is stored in these utility properties
    basic: {},
  }
}

const donationFormData = createDonationFormData()
export default donationFormData
