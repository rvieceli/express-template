import CreateUserService from '../../services/CreateUserService';

class Controller {
  async store(request, response) {
    const { name, email, password, endpoint } = request.body;

    await CreateUserService.run({
      name,
      email,
      password,
      endpoint,
    });

    return response.json({
      message: 'We send you email to confirmation account.',
    });
  }
}

export default new Controller();
