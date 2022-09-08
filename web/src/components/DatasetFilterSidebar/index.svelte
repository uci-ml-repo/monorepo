<script lang="ts">
  import { fade } from 'svelte/transition'
  import { createForm } from 'felte'
  import {
    CharacteristicOptions,
    SubjectAreaOptions,
    TaskOptions,
    NumAttributeOptions,
    NumInstanceOptions,
    AttributeTypeOptions,
  } from './Options'

  const { form, data } = createForm({
    onSubmit(data) {
      console.log(data)
    },
  })
</script>

<form use:form class="w-full p-4">
  <button type="submit" class="btn btn-accent block ml-auto">Submit</button>

  <div class="flex flex-col">
    <div class="flex gap-4">
      {#if $data.characteristic}
        <h1 transition:fade>hi</h1>
      {/if}
      <span>Characteristics</span>
    </div>
    <div class="px-2">
      {#each CharacteristicOptions as option}
        <label class="label cursor-pointer">
          <span class="label-text">{option.label}</span>
          <input
            type="radio"
            name="characteristic"
            class="radio radio-primary"
            value={option.value}
          />
        </label>
      {/each}
    </div>

    <div class="divider my-0" />

    <div class="flex items-center">
      <label class="label cursor-pointer">
        {#if Boolean($data.subject_area?.length)}
          <input type="checkbox" class="checkbox checkbox-primary" transition:fade />
        {/if}
        <span class="label-text">Subject Area</span>
      </label>
    </div>
    {#each SubjectAreaOptions as option}
      <label class="label cursor-pointer">
        <span class="label-text">{option.label}</span>
        <input
          type="checkbox"
          name="subject_area"
          class="checkbox checkbox-primary"
          value={option.value}
        />
      </label>
    {/each}

    <div class="divider my-0" />

    <span>Associated Tasks</span>
    {#each TaskOptions as option}
      <label class="label cursor-pointer">
        <span class="label-text">{option.label}</span>
        <input type="radio" name="task" class="radio radio-primary" value={option.value} />
      </label>
    {/each}

    <div class="divider my-0" />

    <span># Attributes</span>
    {#each NumAttributeOptions as option}
      <label class="label cursor-pointer">
        <span class="label-text">{option.label}</span>
        <input
          type="radio"
          name="num_attributes"
          class="radio radio-primary"
          value={option.value}
        />
      </label>
    {/each}

    <div class="divider my-0" />

    <span># Instances</span>
    {#each NumInstanceOptions as option}
      <label class="label cursor-pointer">
        <span class="label-text">{option.label}</span>
        <input
          type="radio"
          name="num_instances"
          class="radio radio-primary"
          value={option.value}
        />
      </label>
    {/each}

    <div class="divider my-0" />

    <span>Attribute Types</span>
    {#each AttributeTypeOptions as option}
      <label class="label cursor-pointer">
        <span class="label-text">{option.label}</span>
        <input
          type="radio"
          name="attribute_type"
          class="radio radio-primary"
          value={option.value}
        />
      </label>
    {/each}
  </div>
</form>
