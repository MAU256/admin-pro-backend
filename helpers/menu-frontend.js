 const getMenuFrontend = (role = 'USER_ROLE') => {
    const menu  = [
        {
          titulo: 'Principal',
          icono: 'mdi mdi-gauge',
          submenu:[
            {titulo: 'Dashboard', url: '/'},        
            // {titulo: 'ProgressBar', url: 'progress'},
            // {titulo: 'Graficas', url: 'grafica1'},
            // {titulo: 'Promesas', url: 'promesas'},
            // {titulo: 'Rxjs', url: 'rxjs'}
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu:[
            // {titulo: 'Usuarios', url: 'usuarios'},        
            // {titulo: 'Hospitales', url: 'hospitales'},
            {titulo: 'Medicos', url: 'medicos'},
            {titulo: 'Pacientes', url: 'pacientes'},
            {titulo: 'Citas', url: 'citas'},
          ]
        }
      ];

      if(role === 'ADMIN_ROLE'){
        menu[1].submenu.unshift({titulo: 'Usuarios', url: 'usuarios'});
      }

      return menu

}

module.exports = {
    getMenuFrontend
}