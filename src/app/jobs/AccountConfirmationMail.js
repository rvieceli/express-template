import Mail from '../../lib/Mail';

class AccountConfirmationMail {
  get key() {
    return 'AccountConfirmationMail';
  }

  async handle({ data }) {
    const { user, link } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Confirme seu cadastro',
      template: 'UserStore@account_confirmation',
      context: {
        user,
        link,
      },
    });
  }
}

export default new AccountConfirmationMail();
