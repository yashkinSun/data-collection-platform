import mysql from 'mysql2/promise';

async function checkData() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  const [rows] = await connection.execute(
    'SELECT id, token, status, data FROM submissions ORDER BY id DESC LIMIT 3'
  );
  
  for (const row of rows) {
    console.log(`\n=== Submission ID: ${row.id} ===`);
    console.log(`Token: ${row.token}`);
    console.log(`Status: ${row.status}`);
    
    const data = JSON.parse(row.data);
    console.log('\nСтруктура данных:');
    console.log('- additionalInfo:', !!data.additionalInfo);
    
    if (data.additionalInfo) {
      console.log('✅ additionalInfo найден:');
      console.log(JSON.stringify(data.additionalInfo, null, 2));
    } else {
      console.log('❌ additionalInfo отсутствует');
    }
  }
  
  await connection.end();
}

checkData().catch(console.error);
