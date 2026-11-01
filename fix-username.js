// fix-username.js - Script para corrigir usernames
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function fixUsernames() {
  const mongoUri = process.env.mongoUri;
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('StumbleBorn');
    const users = db.collection('Users');

    console.log('🔍 Procurando usuários com .gg/sgmasters...');

    // Encontra todos os usuários com sgmasters
    const result = await users.updateMany(
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

    console.log(`✅ Migrados: ${result.modifiedCount} usuários`);

    // Também força o usuário 501 a ter sgzone
    const user501 = await users.findOne({ id: 501 });
    if (user501) {
      console.log(`\n📝 Usuário 501 encontrado:`);
      console.log(`   Username atual: ${user501.username}`);

      if (!user501.username.includes('.gg/sgzone')) {
        await users.updateOne(
          { id: 501 },
          { $set: { username: `.gg/sgold<#ffff00><sup>501</sup>` } }
        );
        console.log(`   ✅ Username atualizado para: .gg/sgold<#ffff00><sup>501</sup>`);
      } else {
        console.log(`   ✅ Já está com .gg/sgold`);
      }
    } else {
      console.log('❌ Usuário 501 não encontrado');
    }

    // Mostra todos os usuários
    console.log('\n📊 Todos os usuários:');
    const allUsers = await users.find({}).project({ id: 1, username: 1 }).toArray();
    allUsers.forEach(u => {
      console.log(`   ID: ${u.id} - Username: ${u.username}`);
    });

  } catch (err) {
    console.error('❌ Erro:', err);
  } finally {
    await client.close();
  }
}

fixUsernames();
