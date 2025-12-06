// Простой скрипт для проверки additionalInfo в БД (CommonJS)
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkData() {
  console.log('=== Проверка данных additionalInfo в БД ===\n');
  
  let connection;
  
  try {
    // Попытка подключения через DATABASE_URL
    if (process.env.DATABASE_URL) {
      console.log('✅ Подключение через DATABASE_URL...');
      connection = await mysql.createConnection(process.env.DATABASE_URL);
    } else {
      // Альтернативное подключение
      console.log('⚠️  DATABASE_URL не найден, использую localhost...');
      connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'family_questionnaire'
      });
    }
    
    console.log('✅ Подключение к БД успешно\n');
    
    const [rows] = await connection.execute(
      'SELECT id, token, status, data, submittedAt FROM submissions ORDER BY id DESC LIMIT 5'
    );
    
    console.log(`Найдено записей: ${rows.length}\n`);
    
    if (rows.length === 0) {
      console.log('⚠️  В таблице submissions нет данных');
      await connection.end();
      return;
    }
    
    for (const row of rows) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`=== Submission ID: ${row.id} ===`);
      console.log(`Token: ${row.token}`);
      console.log(`Status: ${row.status}`);
      console.log(`Submitted: ${row.submittedAt || 'N/A'}`);
      
      try {
        const data = JSON.parse(row.data);
        
        console.log('\n📊 Структура данных:');
        console.log('  - consent:', !!data.consent);
        console.log('  - respondent:', !!data.respondent);
        console.log('  - parents:', !!data.parents);
        console.log('  - grandparents:', !!data.grandparents);
        console.log('  - places:', !!data.places);
        console.log('  - traditions:', !!data.traditions);
        console.log('  - additionalInfo:', !!data.additionalInfo);
        
        if (data.additionalInfo) {
          console.log('\n✅ additionalInfo НАЙДЕН:');
          console.log(JSON.stringify(data.additionalInfo, null, 2));
          
          if (data.additionalInfo.freeText) {
            console.log(`\n📝 Текст (первые 100 символов):`);
            const preview = data.additionalInfo.freeText.substring(0, 100);
            console.log(`"${preview}${data.additionalInfo.freeText.length > 100 ? '...' : ''}"`);
          } else {
            console.log('\n⚠️  additionalInfo существует, но freeText пуст');
          }
        } else {
          console.log('\n❌ additionalInfo ОТСУТСТВУЕТ');
          console.log('Возможные причины:');
          console.log('  1. Опросник заполнен до добавления шага additionalInfo');
          console.log('  2. Пользователь не заполнил это поле');
          console.log('  3. Данные не сохраняются из формы');
        }
        
        // Проверка размера данных
        const dataSize = JSON.stringify(data).length;
        console.log(`\n📦 Размер данных: ${dataSize} байт (${(dataSize / 1024).toFixed(2)} KB)`);
        
      } catch (error) {
        console.error('❌ Ошибка парсинга JSON:', error.message);
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('\n✅ Проверка завершена');
    
    await connection.end();
    
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkData();
