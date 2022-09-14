<script>
  import ProfileIcon from '$components/Icons/Profile.svelte'
  import DatabaseIcon from '$components/Icons/Database.svelte'

  const fakeUser = {
    firstName: 'Ad',
    lastName: 'Min',
    user: 'a@a.com',
    role: 'Admin',
    pass: 'root',
  }
</script>

<svelte:head>
  <title>Profile - UC Irvine Machine Learning Repository</title>
</svelte:head>

<div class="grid grid-cols-2 gap-12 mx-auto w-3/4 my-16">
  <div class="flex flex-col gap-8 p-4 rounded-lg bg-white border shadow">
    <div class="flex justify-start gap-6 items-center">
      <ProfileIcon class="h-12 text-primary" />
      <div>
        <h1 class="text-2xl text-primary">Profile</h1>
        <p>None of this info is visible to other users.</p>
      </div>
    </div>
    <div>
      <ul class="px-4 flex flex-col gap-6 pb-6">
        <li class="grid grid-cols-2 w-3/4">
          <div>Name</div>
          <div>
            {fakeUser.firstName ? fakeUser.firstName : ''}
            {fakeUser.lastName ? fakeUser.lastName : ''}
          </div>
        </li>
        <li class="grid grid-cols-2 w-3/4">
          <div>Email</div>
          <div>{fakeUser.user ? fakeUser.user : ''}</div>
        </li>
        <li class="grid grid-cols-2 w-3/4">
          <div>Permissions</div>
          <div>{fakeUser.role ? fakeUser.role : ''}</div>
        </li>
        <li class="grid grid-cols-2 w-3/4">
          <div>Institution</div>
          <div>{fakeUser.institution ? fakeUser.institution : ''}</div>
        </li>
        <li class="grid grid-cols-2 w-3/4">
          <div>Address</div>
          <div>{fakeUser.address ? fakeUser.address : ''}</div>
        </li>
        <li class="grid grid-cols-2 w-3/4">
          <div>Password</div>
          <div>
            {fakeUser.google || fakeUser.github ? 'Managed by third party' : '********'}
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="flex flex-col gap-8 p-4 rounded-lg bg-white border shadow">
    <div class="flex justify-start gap-6 items-center">
      <DatabaseIcon class="h-12 text-primary" />
      <h1 class="text-2xl text-primary">Your Donated Datasets</h1>
    </div>
    <div class="flex justify-around">
      <div class="form-control">
        <label class="label cursor-pointer gap-4">
          <input type="checkbox" checked="checked" class="checkbox checkbox-primary" />
          <span class="label-text">APPROVED</span>
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer gap-4">
          <input type="checkbox" checked="checked" class="checkbox checkbox-primary" />
          <span class="label-text">PENDING</span>
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer gap-4">
          <input type="checkbox" checked="checked" class="checkbox checkbox-primary" />
          <span class="label-text">REJECTED</span>
        </label>
      </div>
    </div>
  </div>
  <div class="p-4 rounded-lg bg-white border shadow col-span-2">3</div>
</div>
