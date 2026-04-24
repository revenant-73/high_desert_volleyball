import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: process.env.NODE_ENV === 'production' 
    ? { 
        kind: 'github', 
        repo: 'revenant-73/high_desert_volleyball' // Ensure this matches your "owner/repo" on GitHub
      } 
    : { kind: 'local' },
  collections: {
    events: collection({
      label: 'Events',
      slugField: 'name',
      path: 'src/content/events/*',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Event Name' }),
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
        name: fields.text({ label: 'Venue Name' }),
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
});
