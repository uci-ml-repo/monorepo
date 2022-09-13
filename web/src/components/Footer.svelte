<script lang="ts">
  const FooterLinks = [
    {
      href: '/',
      link: 'Home',
    },
    {
      href: '/ml/datasets',
      link: 'Datasets',
    },
    {
      href: '/ml/donation-policy',
      link: 'Donate a Dataset',
    },
    {
      href: '/ml/about',
      link: 'About Us',
    },
    {
      href: '/ml/contact',
      link: 'Contact Us',
    },
    {
      href: 'https://cml.ics.uci.edu',
      link: 'CML',
    },
    {
      href: '/ml/privacy-notice',
      link: 'Privacy Notice',
    },
  ]
</script>

<footer
  class="grid grid-cols-1 gap-4 justify-items-center md:grid-cols-2 bg-primary text-white p-4"
>
  <div class="col-span-1">
    <div class="text-center">
      <h1 class="text-2xl font-semibold">UC Irvine</h1>
      <h1 class="text-2xl font-semibold">Machine Learning Repository</h1>
    </div>
    <div>
      <span class="text-lg font-semibold">Contact: </span>
      <a href="mailto:ml-repository@ics.uci.edu" class="hover:underline"
        >ml-repository@ics.uci.edu</a
      >
    </div>
    <div>
      <span class="text-lg font-semibold">Supported by: </span>
      <a target="_blank" href="https://www.nsf.gov" class="hover:underline"
        >National Science Foundation</a
      >
    </div>
    <div>
      <a
        target="_blank"
        href="https://github.com/uci-ml-repo/ucimlrepo-feedback/issues/new/choose"
        class="text-lg font-semibold hover:underline">Make a Feature Request or Bug Report</a
      >
    </div>
  </div>
  <div class="col-span-1 flex flex-wrap items-center gap-4">
    {#each FooterLinks as link}
      <a target="_blank" href={link.href} class="hover:underline">{link.link}</a>
    {/each}
  </div>
</footer>
