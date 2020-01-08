import Mail from '../../lib/Mail';

class ForgotPasswordMail {
  get key() {
    return 'ForgotPasswordMail';
  }

  async handle({ data }) {
    const { user, link } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Recuperação de senha',
      template: 'ForgotPassword@reset_password',
      context: {
        user,
        link,
      },
    });
  }
}

export default new ForgotPasswordMail();
