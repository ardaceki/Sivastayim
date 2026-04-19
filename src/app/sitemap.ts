import { MetadataRoute } from 'next'
import places from '@/data/places.json'
import people from '@/data/people.json'
import dishesData from '@/data/dishes.json'
import heritage from '@/data/heritage.json'

const baseUrl = 'https://www.sivastayim.info'

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = []

    // 1. Static Core Routes
    const staticRoutes = [
        { path: '', priority: 1.0 },
        { path: '/map', priority: 0.9 },
        { path: '/portraits', priority: 0.9 },
        { path: '/dishes', priority: 0.9 },
        { path: '/heritage', priority: 0.9 }
    ]

    staticRoutes.forEach(({ path, priority }) => {
        // Turkish Base
        sitemapEntries.push({
            url: `${baseUrl}/tr${path}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority,
            alternates: {
                languages: {
                    'tr': `${baseUrl}/tr${path}`,
                    'en': `${baseUrl}/en${path}`,
                },
            },
        })
        // English Base
        sitemapEntries.push({
            url: `${baseUrl}/en${path}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority,
            alternates: {
                languages: {
                    'tr': `${baseUrl}/tr${path}`,
                    'en': `${baseUrl}/en${path}`,
                },
            },
        })
    })

    // Helper for generating bilingual dynamic route entries
    const addDynamicEntries = (items: any[], basePath: string, priority: number) => {
        items.forEach((item) => {
            const id = item.id?.toString().toLowerCase().replace(/\s+/g, '-'); // Ensure URL-friendly slug
            if (!id) return;

            // TR Entry
            sitemapEntries.push({
                url: `${baseUrl}/tr${basePath}/${id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority,
                alternates: {
                    languages: {
                        'tr': `${baseUrl}/tr${basePath}/${id}`,
                        'en': `${baseUrl}/en${basePath}/${id}`,
                    },
                },
            })
            // EN Entry
            sitemapEntries.push({
                url: `${baseUrl}/en${basePath}/${id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority,
                alternates: {
                    languages: {
                        'tr': `${baseUrl}/tr${basePath}/${id}`,
                        'en': `${baseUrl}/en${basePath}/${id}`,
                    },
                },
            })
        })
    }

    // 2. Dynamic Location/Place Routes (42+ items)
    addDynamicEntries(places, '/map', 0.7)

    // 3. Dynamic Portrait Routes (40 items)
    addDynamicEntries(people, '/portraits', 0.8)

    // 4. Dynamic Dishes Routes (18 items)
    addDynamicEntries(dishesData.dishes, '/dishes', 0.7)

    // 5. Dynamic Heritage Routes (6 items)
    addDynamicEntries(heritage, '/heritage', 0.8)

    return sitemapEntries
}