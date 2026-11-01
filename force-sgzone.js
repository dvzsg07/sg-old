// force-sgzone.js - Força todos os usuários a terem .gg/sgzone
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function forceSgzone() {
  const mongoUri = process.env.mongoUri;
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('StumbleBorn');
    const users = db.collection('Users');

    console.log('🔄 Forçando todos os usuários para .gg/sgold...\n');

    // Atualiza TODOS os usuários que têm sgmasters
    const result1 = await users.updateMany(
      { username: { $regex: /\.gg\/sgmasters/ } },
      [
        {
          $set: {
            username: {
              $replaceOne: {
                input: "$username",
                find: ".gg/sgmasters",
                replacement: ".gg/sgold"
              }
            }
          }
        }
      ]
    );

    console.log(`✅ Migrados ${result1.modifiedCount} usuários de sgmasters para sgold`);

    // Força o usuário 501 especificamente
    const result2 = await users.updateOne(
      { id: 501 },
      { $set: { username: `.gg/sgold<#ffff00><sup>501</sup>` } }
    );

    console.log(`✅ Usuário 501 atualizado (matched: ${result2.matchedCount}, modified: ${result2.modifiedCount})`);

    // Mostra o resultado
    const user501 = await users.findOne({ id: 501 });
    console.log(`\n📝 Usuário 501 agora tem:`);
    console.log(`   Username: ${user501.username}`);
    console.log(`   ID: ${user501.id}`);
    console.log(`   DeviceId: ${user501.deviceId}`);

    console.log('\n✅ Atualização concluída!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Faça logout do jogo');
    console.log('   2. Limpe o cache do aplicativo');
    console.log('   3. Faça login novamente');
    console.log('   4. O nome deve aparecer como .gg/sgzone');

  } catch (err) {
    console.error('❌ Erro:', err);
  } finally {
    await client.close();
  }
}

forceSgzone();
