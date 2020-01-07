import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import authConfig from '../../config/auth';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        externalId: Sequelize.UUID,
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
        resetPasswordToken: Sequelize.UUID,
        resetPasswordExpires: Sequelize.DATE,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    this.addHook('beforeCreate', async user => {
      user.externalId = uuid();
      user.active = false;
    });

    return this;
  }

  static findByEmail(email) {
    return this.findOne({ where: { email } });
  }

  static findByExternalId(externalId) {
    return this.findOne({ where: { externalId } });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  activate() {
    return this.update({
      externalId: uuid(),
      active: true,
    });
  }

  generateToken() {
    return jwt.sign(
      {
        id: this.externalId,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      }
    );
  }

  // TODO: review this to serialize better
  // https://medium.com/riipen-engineering/serializing-data-with-sequelize-6c3a9633797a
  toJSON() {
    const { externalId, name, email } = this;

    return {
      externalId,
      name,
      email,
    };
  }
}

export default User;
