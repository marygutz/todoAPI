// module.exports takes a function specific to sequelize,
// with the first arg being sequelize (instance)
// second, datatypes to return model
module.exports = function (sequelize, DataTypes) {
	// add new model here
  return sequelize.define('todo', {
	  description: {
	    type: DataTypes.STRING,
	    allowNull: false,
	    validate: {
	    	len: [1, 250]
	    }
	  },
	  completed: {
	    type: DataTypes.BOOLEAN,
	    allowNull: false,
	    defaultValue: false
	  }
  })
}

