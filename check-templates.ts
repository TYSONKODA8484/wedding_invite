import { db } from './server/db';
import { templates } from '@shared/schema';

const result = await db.select().from(templates);
result.forEach((t, idx) => {
  console.log(`${idx+1}. ${t.templateName} (${t.templateType}, ${t.category})`);
  const json = typeof t.templateJson === 'string' ? JSON.parse(t.templateJson) : t.templateJson;
  if (json.pages) {
    json.pages.forEach((p: any) => {
      const hasImages = p.media?.filter((m: any) => m.type === 'image').length || 0;
      const hasVideos = p.media?.filter((m: any) => m.type === 'video').length || 0;
      console.log(`   Page ${p.page_number}: ${hasImages} image(s), ${hasVideos} video(s)`);
    });
  }
});
