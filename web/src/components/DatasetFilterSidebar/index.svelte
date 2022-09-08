<script lang="ts">
  import { createForm } from 'felte'
  import {
    CharacteristicOptions,
    SubjectAreaOptions,
    TaskOptions,
    NumAttributeOptions,
    NumInstanceOptions,
    AttributeTypeOptions,
  } from './Options'

  import Collapse from '$components/Collapse.svelte'

  const { form } = createForm({
    onSubmit(data) {
      console.log(data)
    },
  })
</script>

<form use:form class="w-full p-4">
  <button type="submit" class="btn btn-accent block ml-auto">Submit</button>

  <div class="flex flex-col">
    <Collapse completeClose>
      <span slot="parent">Characteristics</span>
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
    </Collapse>

    <div class="divider my-0" />

    <Collapse completeClose>
      <span slot="parent">Subject Area</span>
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
    </Collapse>

    <div class="divider my-0" />

    <Collapse completeClose>
      <span slot="parent">Associated Tasks</span>
      {#each TaskOptions as option}
        <label class="label cursor-pointer">
          <span class="label-text">{option.label}</span>
          <input type="radio" name="task" class="radio radio-primary" value={option.value} />
        </label>
      {/each}
    </Collapse>

    <div class="divider my-0" />

    <Collapse completeClose>
      <span slot="parent"># Attributes</span>
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
    </Collapse>

    <div class="divider my-0" />

    <Collapse completeClose>
      <span slot="parent"># Instances</span>
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
    </Collapse>

    <div class="divider my-0" />

    <Collapse completeClose>
      <span slot="parent">Attribute Types</span>
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
    </Collapse>
  </div>
</form>
