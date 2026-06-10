import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    labs: defineCollection({
      type: 'page',
      source: 'labs/**',
      schema: z.object({
        room_id: z.string(),
        name: z.string(),
        building_id: z.string(),
        floor: z.number(),
        departments: z.array(z.string()),
        head_of_lab: z.object({
          name: z.string(),
          email: z.string(),
          office: z.string()
        }),
        status: z.string(),
        highlighted_equipment: z.array(z.string())
      })
    }),
    equipment: defineCollection({
      type: 'page',
      source: 'equipment/**',
      schema: z.object({
        id: z.string(),
        title: z.string(),
        model: z.string(),
        manufacturer: z.string(),
        departments: z.array(z.string()),
        location: z.object({
          building_id: z.string(),
          floor: z.number(),
          room_id: z.string(),
          station_id: z.string()
        }),
        media: z.object({
          images: z.array(z.string()),
          internal_blueprint: z.string().optional(),
          ambient_color: z.string().default('#EF5A24')
        }),
        physics: z.object({
          primary_mechanism: z.string(),
          mathematical_model: z.string(),
          equation: z.string(),
          target_materials: z.array(z.string())
        }),
        specifications: z.record(z.string()),
        links: z.array(z.object({
          title: z.string(),
          url: z.string()
        })),
        status: z.string().default('operational')
      })
    })
  }
})
