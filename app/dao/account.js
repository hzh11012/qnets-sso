const prisma = require('@core/prisma');
const {HttpException} = require('@core/http-exception');

class AccountDao {
    static async findOrCreate(email) {
        try {
            const account = await prisma.account.findUnique({
                where: {email}
            });

            if (account) return [null, account];

            const newAccount = await prisma.account.create({
                data: {email}
            });

            return [null, newAccount];
        } catch (err) {
            return [new HttpException(), null];
        }
    }
}

module.exports = AccountDao;
