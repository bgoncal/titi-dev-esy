'use strict';

angular
	.module('titi')
  .factory('helperService', [helperService]);

function helperService() {
  var helper = {};

  helper.regex = {
    CEP: /^[0-9]{5}[-][0-9]{3}/,
    phone: /^[(][0-9]{2}[)] [0-9]{4}[0-9]?[-][0-9]{4}/,
    year: /^[0-9]{4}/
  };

  helper.backendUrl = 'http://titi.net.br/_prd';

  helper.UFOptions = [
    {
      sigla: "AC",
      name: "Acre"
    },
    {
      sigla: "AL",
      name: "Alagoas"
    },
    {
      sigla: "AM",
      name: "Amazonas"
    },
    {
      sigla: "AP",
      name: "Amapá"
    },
    {
      sigla: "BA",
      name: "Bahia"
    },
    {
      sigla: "CE",
      name: "Ceará"
    },
    {
      sigla: "DF",
      name: "Distrito Federal"
    },
    {
      sigla: "ES",
      name: "Espírito Santo"
    },
    {
      sigla: "GO",
      name: "Goiás"
    },
    {
      sigla: "MA",
      name: "Maranhão"
    },
    {
      sigla: "MG",
      name: "Minas Gerais"
    },
    {
      sigla: "MS",
      name: "Mato Grosso do Sul"
    },
    {
      sigla: "MT",
      name: "Mato Grosso"
    },
    {
      sigla: "PA",
      name: "Pará"
    },
    {
      sigla: "PB",
      name: "Paraíba"
    },
    {
      sigla: "PE",
      name: "Pernambuco"
    },
    {
      sigla: "PI",
      name: "Piauí"
    },
    {
      sigla: "PR",
      name: "Paraná"
    },
    {
      sigla: "RJ",
      name: "Rio de Janeiro"
    },
    {
      sigla: "RN",
      name: "Rio Grande do Norte"
    },
    {
      sigla: "RO",
      name: "Rondônia"
    },
    {
      sigla: "RR",
      name: "Roraima"
    },
    {
      sigla: "RS",
      name: "Rio Grande do Sul"
    },
    {
      sigla: "SC",
      name: "Santa Catarina"
    },
    {
      sigla: "SE",
      name: "Sergipe"
    },
    {
      sigla: "SP",
      name: "São Paulo"
    },
    {
      sigla: "TO",
      name: "Tocantins"
    }
  ];

  helper.orgaoEmissorOptions = [
    {
      id: 'COREN',
      name: 'COREN'
    },
    {
      id: 'CREFITO',
      name: 'CREFITO'
    },
    {
      id: 'CRM',
      name: 'CRM'
    },
    {
      id: 'OUTRO',
      name: 'CUIDADOR'
    }
  ];

  helper.partnerOptions = [
    {
      id: '1',
      name: 'Auxiliar/Técnico enfermagem'
    },
    {
      id: '2',
      name: 'Enfermeiro'
    },
    {
      id: '3',
      name: 'Cuidador'
    },
    {
      id: '4',
      name: 'Fisioterapeuta'
    }/*,
    {
      id: '5',
      name: 'Fonoaudiólogo'
    }*/
  ];

  helper.periodoOptions = [
    {
      id: '1',
      name: 'Diurno'
    },
    {
      id: '2',
      name: 'Noturno'
    }
  ];

  helper.perfilEspecialistaOptions = [
    {
      id: '2',
      name: 'Pediatria'
    },
    {
      id: '4',
      name: 'Adulto'
    },
    {
      id: '5',
      name: 'Idoso'
    }
  ];

  helper.habilidadeOptions = [
    {
      id: '3',
      name: 'Alta Complexidade'
    },
    {
      id: '2',
      name: 'Média Complexidade'
    },
    {
      id: '1',
      name: 'Baixa Complexidade'
    }
  ];

  helper.linkOptions = [
	  {
      href: '#/users/login/partners',
      title: 'Profissionais',
			type: 2
    },
    {
      href: '#/users/login/customers',
      title: 'Clientes',
			type: 3
    },
    {
      href: '#/#titi',
      title: 'O que é TITI?',
			type: 0
    },
    /*{
      href: '#/contact',
      title: 'Contato',
			type: 0
    }*/
    /*{
      href: '#/faq',
      title: 'Dúvidas frequentes',
			type: 0
    },
    {
      href: '#/terms-of-use',
      title: 'Termos de uso',
			type: 0
    }*/
  ];

  return helper;
}
