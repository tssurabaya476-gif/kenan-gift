/* Data Loader Module */
export class DataLoader {
  static async loadAllData() {
    try {
      const [config, profile, gallery, milestones, videos] = await Promise.all([
        fetch('data/config.json').then(res => res.json()),
        fetch('data/profile.json').then(res => res.json()),
        fetch('data/gallery.json').then(res => res.json()),
        fetch('data/milestones.json').then(res => res.json()),
        fetch('data/videos.json').then(res => res.json())
      ]);

      return { config, profile, gallery, milestones, videos };
    } catch (error) {
      console.error('Failed to load application data:', error);
      throw error;
    }
  }
}

