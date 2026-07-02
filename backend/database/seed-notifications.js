const { pool } = require('../src/config/db');

const SEEDS = [
  {
    type: 'welcome',
    title: 'Welcome to CampusHub! 👋',
    body: 'Explore restaurants, salons, laundries, cabs & autos — all in one place. Tap any service to get started.',
    source: 'system',
  },
  {
    type: 'deal',
    title: '20% off at The Campus Cafe 🏷️',
    body: 'Show this notification at the counter to avail 20% off on all orders this weekend. Valid Sat–Sun only.',
    source: 'system',
  },
  {
    type: 'info',
    title: 'New auto-rickshaw drivers registered ℹ️',
    body: '3 new auto drivers have been added near Block C. Check the Autos section to view availability and fares.',
    source: 'system',
  },
];

async function seedNotifications() {
  try {
    console.log('Checking if notifications are already seeded...');
    const checkRes = await pool.query('SELECT COUNT(*) FROM notifications');
    const count = parseInt(checkRes.rows[0].count);

    if (count > 0) {
      console.log(`Database already has ${count} notifications. Skipping seeding.`);
      return;
    }

    console.log('Seeding default notifications...');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Seeds valid for 30 days

    for (const seed of SEEDS) {
      await pool.query(
        'INSERT INTO notifications (type, title, body, source, expires_at) VALUES ($1, $2, $3, $4, $5)',
        [seed.type, seed.title, seed.body, seed.source, expiresAt]
      );
    }
    console.log('Default notifications seeded successfully!');
  } catch (error) {
    console.error('Error seeding notifications:', error);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

seedNotifications();
