import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    events: collection({
      label: 'Events',
      slugField: 'name',
      path: 'src/content/events/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Event Name' } }),
        date: fields.text({ label: 'Date' }),
        age: fields.text({ label: 'Age Range' }),
        price: fields.text({ label: 'Price' }),
        description: fields.text({ label: 'Description', multiline: true }),
      },
    }),
    venues: collection({
      label: 'Venues',
      slugField: 'name',
      path: 'src/content/venues/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Venue Name' } }),
        address: fields.text({ label: 'Address' }),
        rules: fields.array(
          fields.text({ label: 'Rule' }),
          {
            label: 'Rules',
            itemLabel: props => props.value,
          }
        ),
      },
    }),
  },
  singletons: {
    siteConfig: singleton({
      label: 'Site Configuration',
      path: 'src/content/site-config',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Site Name' }),
        shortName: fields.text({ label: 'Short Name' }),
        tagline: fields.text({ label: 'Tagline' }),
        email: fields.text({ label: 'Email' }),
        description: fields.text({ label: 'Description', multiline: true }),
        links: fields.object({
          register: fields.text({ label: 'Register Link' }),
          waiver: fields.text({ label: 'Waiver Link' }),
        }),
      },
    }),
  },
});
