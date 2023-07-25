module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  generateIcons: function (number) {
    let icons = ''
    for (let i = 0; i < number; i++) {
      icons += '<i class="fa-brands fa-gratipay" style="color: #ff5290;"></i>'
    }
    return icons
  },
  genderIcon: function (gender) {
    switch (gender) {
      case 'male':
        return '<i class="fa-solid fa-mars" style="color: #1e3150;"></i>'
      case 'female':
        return '<i class="fa-solid fa-venus" style="color: #ff5290;"></i>'
      case 'unknown':
        return '<i class="fa-regular fa-circle-question" style="color: #787878;"></i>'
    }
  },
  neuterIcon: function (neuter) {
    switch (neuter) {
      case 'neutered':
        return '<i class="fa-solid fa-neuter" style="color: #1e3150;"></i>'
      case 'unNeutered':
        return '<i class="fa-regular fa-circle-xmark" style="color: #1e3150;"></i>'
      case 'unknown':
        return '<i class="fa-regular fa-circle-question" style="color: #787878;"></i>'
    }
  }
}
