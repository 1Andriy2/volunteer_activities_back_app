const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
  async loginByPhoneOrEmail(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      throw new ApplicationError('Email/Phone number and password are required.');
    }

    // Check if identifier is an email or phone number
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const searchCriteria = isEmail ? { email: identifier } : { phone: identifier };

    // Find the user by email or phone number
    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: searchCriteria });

    if (!user) {
      throw new ApplicationError('User not found.');
    }

    // Validate the password
    const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
      password,
      user.password
    );

    if (!validPassword) {
      throw new ApplicationError('Invalid password.');
    }

    // Send the JWT and user data
    ctx.send({
      jwt: strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  },
};
