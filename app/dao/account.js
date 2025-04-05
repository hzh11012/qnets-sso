const prisma = require('@core/prisma');

class AccountDao {
    static async findOrCreate(phone) {
        try {
            const account = await prisma.account.findUnique({
                where: {phone}
            });

            if (account) return [null, account];

            const newAccount = await prisma.account.create({
                data: {phone}
            });

            return [null, newAccount];
        } catch (err) {
            return [err, null];
        }
    }
}

module.exports = AccountDao;
