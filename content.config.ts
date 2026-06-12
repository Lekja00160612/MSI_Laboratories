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
          images: z.array(z.union([
            z.string(),
            z.object({
              src: z.string().optional(),
              url: z.string().optional(),
              path: z.string().optional(),
              title: z.string().optional(),
              position: z.number().optional(),
              highlighted: z.boolean().optional()
            })
          ])),
          video: z.union([
            z.string(),
            z.object({
              src: z.string().optional(),
              url: z.string().optional(),
              path: z.string().optional(),
              title: z.string().optional(),
              position: z.number().optional()
            })
          ]).optional(),
          model_3d: z.union([
            z.string(),
            z.object({
              src: z.string().optional(),
              url: z.string().optional(),
              path: z.string().optional(),
              title: z.string().optional(),
              position: z.number().optional()
            })
          ]).optional(),
          internal_blueprint: z.union([
            z.string(),
            z.object({
              src: z.string().optional(),
              url: z.string().optional(),
              path: z.string().optional(),
              title: z.string().optional(),
              position: z.number().optional(),
              target_image: z.string().optional()
            })
          ]).optional(),
          ambient_color: z.string().default('#EF5A24')
        }),
        status: z.string().default('operational'),
        category: z.string().optional(),
        optional_information: z.object({
          physics: z.object({
            primary_mechanism: z.string(),
            mathematical_model: z.string(),
            equation: z.string(),
            target_materials: z.array(z.string())
          }).optional(),
          specifications: z.record(z.string()).optional(),
          links: z.array(z.object({
            title: z.string(),
            url: z.string()
          })).optional()
        }).catchall(z.any()).optional()
      })
    })
  }
})
