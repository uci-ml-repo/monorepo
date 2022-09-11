<script lang="ts">
  export let name = 'descriptive.'

  import { ValidationMessage } from '@felte/reporter-svelte'

  const descriptive_fields = [
    'purpose',
    'funding',
    'represent',
    'dataSplits',
    'sensitiveInfo',
    'preprocessingDescription',
    'used',
    'otherInfo',
    'datasetCitation',
  ] as const

  const descriptive_labels: { [key in typeof descriptive_fields[number]]: string } = {
    purpose: 'For what purpose was the dataset created?',
    funding: 'Who funded the creation of the dataset?',
    represent: 'What do the instances that comprise the dataset represent?',
    dataSplits: 'Are there recommended data splits?',
    sensitiveInfo:
      'Does the dataset contain data that might be considered sensitive in any way?',
    preprocessingDescription: 'Was there any data preprocessing performed?',
    used: 'Has the dataset been used for any tasks already?',
    otherInfo: 'Additional Information',
    datasetCitation: 'Citation Requests/Acknowledgements',
  }
</script>

{#each descriptive_fields as field}
  <div class="flex flex-col gap-2">
    <label for="">
      {descriptive_labels[field]}
      <input
        type="text"
        name="{name}{field}"
        class="input input-bordered input-primary w-full"
      />
    </label>
    <ValidationMessage for="{name}.field" let:messages>
      <span class="text-error">{messages || ''}</span>
    </ValidationMessage>
  </div>
{/each}
