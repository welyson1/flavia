document.addEventListener('DOMContentLoaded', () => {
    const schema = {
        "type": "object",
        "properties": {
            "unidadeCurricular": { "type": "string" },
            "anoPeriodo": { "type": "string" },
            "conteudo": { "type": "string" },
            "habilidadesSociais": { "type": "array", "items": { "type": "string" } },
            "funcoesCognitivasCriar": { "type": "string" },
            "funcoesCognitivasAplicar": { "type": "string" },
            "funcoesCognitivasSintetizar": { "type": "string" },
            "funcoesCognitivasEntender": { "type": "string" },
            "funcoesCognitivasAnalisar": { "type": "string" },
            "funcoesCognitivasLembrar": { "type": "string" },
            "ambientacaoAtmosfera": { "type": "string" },
            "ambientacaoCenario": { "type": "string" },
            "ambientacaoEespaco": { "type": "array", "items": { "type": "string" } },
            "enredo": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "problemas": { "type": "string" },
                        "desafios": { "type": "string" },
                        "solucao": { "type": "string" }
                    },
                    "required": ["problemas", "desafios", "solucao"]
                }
            },
            "tema": { "type": "string" },
            "sessoes": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "nome": { "type": "string" },
                        "cenas": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "descricao": { "type": "string" },
                                    "turnos": { "type": "integer" }
                                },
                                "required": ["descricao", "turnos"]
                            }
                        }
                    },
                    "required": ["nome", "cenas"]
                }
            },
            "funcoes": { "type": "array", "items": { "type": "string" } },
            "regrasAleatoriedade": { "type": "string" },
            "regrasRecompensas": { "type": "string" },
            "regrasFeedback": { "type": "string" },
            "personagens": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "descricao": { "type": "string" },
                        "funcao": { "type": "string" },
                        "categoria": { "type": "string" },
                        "habilidadesTecnicas": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "descricao": { "type": "string" },
                                    "parametros": { "type": "string" }
                                },
                                "required": ["descricao", "parametros"]
                            }
                        },
                        "habilidadesSociais": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "descricao": { "type": "string" },
                                    "parametros": { "type": "string" }
                                },
                                "required": ["descricao", "parametros"]
                            }
                        }
                    },
                    "required": ["descricao", "funcao", "categoria", "habilidadesTecnicas", "habilidadesSociais"]
                }
            },
            "materiais": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "descricao": { "type": "string" },
                        "quantidade": { "type": "string" }
                    },
                    "required": ["descricao", "quantidade"]
                }
            }
        },
        "required": [
            "unidadeCurricular",
            "anoPeriodo",
            "conteudo",
            "habilidadesSociais",
            "funcoesCognitivasCriar",
            "funcoesCognitivasAplicar",
            "funcoesCognitivasSintetizar",
            "funcoesCognitivasEntender",
            "funcoesCognitivasAnalisar",
            "funcoesCognitivasLembrar",
            "ambientacaoAtmosfera",
            "ambientacaoCenario",
            "ambientacaoEespaco",
            "enredo",
            "tema",
            "sessoes",
            "funcoes",
            "regrasAleatoriedade",
            "regrasRecompensas",
            "regrasFeedback",
            "personagens",
            "materiais"
        ]
    };

    const form = document.getElementById('dataForm');
    const saveButton = document.getElementById('saveButton');
    const downloadButton = document.getElementById('downloadButton');
    const uploadInput = document.getElementById('uploadInput');

    // Função para criar tooltips
    function createTooltip(text) {
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = '&#9432;';
        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltiptext';
        tooltipText.innerText = text;
        tooltip.appendChild(tooltipText);
        return tooltip;
    }

    // Função para criar campos de entrada
    function createInputField(key, value, required = false, isArray = false, nestedSchema = null) {
        const div = document.createElement('div');
        div.className = 'field-container';

        const label = document.createElement('label');
        label.innerText = key;
        if (required) {
            label.innerHTML += ' <span style="color: red;">*</span>';
        }
        div.appendChild(label);
        div.appendChild(createTooltip(`Preencha o campo ${key}`));

        let input;
        if (isArray) {
            // Se for um array, criar uma lista de entradas
            const arrayContainer = document.createElement('div');
            arrayContainer.className = 'array-container';

            value.forEach((item, index) => {
                const itemContainer = document.createElement('div');
                itemContainer.className = 'array-item';

                if (nestedSchema && nestedSchema.type === 'object') {
                    // Se for um array de objetos, criar campos para cada propriedade
                    for (const nestedKey in nestedSchema.properties) {
                        const nestedValue = item[nestedKey] || '';
                        const nestedRequired = nestedSchema.required?.includes(nestedKey) || false;
                        const nestedField = createInputField(nestedKey, nestedValue, nestedRequired, false, nestedSchema.properties[nestedKey]);
                        itemContainer.appendChild(nestedField);
                    }
                } else {
                    // Se for um array de valores simples
                    const nestedInput = document.createElement('input');
                    nestedInput.type = 'text';
                    nestedInput.value = item;
                    itemContainer.appendChild(nestedInput);
                }

                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remover';
                removeButton.addEventListener('click', () => {
                    itemContainer.remove();
                });
                itemContainer.appendChild(removeButton);

                arrayContainer.appendChild(itemContainer);
            });

            const addButton = document.createElement('button');
            addButton.innerText = 'Adicionar';
            addButton.addEventListener('click', () => {
                const newItemContainer = document.createElement('div');
                newItemContainer.className = 'array-item';

                if (nestedSchema && nestedSchema.type === 'object') {
                    // Adicionar um novo objeto ao array
                    for (const nestedKey in nestedSchema.properties) {
                        const nestedValue = '';
                        const nestedRequired = nestedSchema.required?.includes(nestedKey) || false;
                        const nestedField = createInputField(nestedKey, nestedValue, nestedRequired, false, nestedSchema.properties[nestedKey]);
                        newItemContainer.appendChild(nestedField);
                    }
                } else {
                    // Adicionar um novo valor ao array
                    const newInput = document.createElement('input');
                    newInput.type = 'text';
                    newInput.value = '';
                    newItemContainer.appendChild(newInput);
                }

                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remover';
                removeButton.addEventListener('click', () => {
                    newItemContainer.remove();
                });
                newItemContainer.appendChild(removeButton);

                arrayContainer.appendChild(newItemContainer);
            });

            div.appendChild(arrayContainer);
            div.appendChild(addButton);
        } else if (nestedSchema && nestedSchema.type === 'object') {
            // Se for um objeto, criar campos para cada propriedade
            for (const nestedKey in nestedSchema.properties) {
                const nestedValue = value[nestedKey] || '';
                const nestedRequired = nestedSchema.required?.includes(nestedKey) || false;
                const nestedField = createInputField(nestedKey, nestedValue, nestedRequired, false, nestedSchema.properties[nestedKey]);
                div.appendChild(nestedField);
            }
        } else {
            // Se for um campo simples
            input = document.createElement('input');
            input.type = 'text';
            input.value = value;
            input.id = key;
            div.appendChild(input);
        }

        return div;
    }

    // Função para carregar os dados no formulário
    function loadData() {
        const data = JSON.parse(localStorage.getItem('data')) || {};
        for (const key in schema.properties) {
            const value = data[key] || '';
            const required = schema.required?.includes(key) || false;
            const isArray = schema.properties[key].type === 'array';
            const nestedSchema = isArray ? schema.properties[key].items : schema.properties[key];
            const inputField = createInputField(key, value, required, isArray, nestedSchema);
            form.appendChild(inputField);
        }
    }

    // Função para salvar os dados no localStorage
    function saveData() {
        const data = {};
        for (const key in schema.properties) {
            const fieldContainer = form.querySelector(`.field-container label:contains("${key}")`)?.parentElement;
            if (fieldContainer) {
                if (schema.properties[key].type === 'array') {
                    const arrayContainer = fieldContainer.querySelector('.array-container');
                    if (arrayContainer) {
                        const items = [];
                        arrayContainer.querySelectorAll('.array-item').forEach(item => {
                            if (schema.properties[key].items.type === 'object') {
                                const obj = {};
                                item.querySelectorAll('input, textarea').forEach(input => {
                                    const nestedKey = input.previousSibling?.innerText.trim();
                                    if (nestedKey) {
                                        obj[nestedKey] = input.value;
                                    }
                                });
                                items.push(obj);
                            } else {
                                items.push(item.querySelector('input').value);
                            }
                        });
                        data[key] = items;
                    }
                } else if (schema.properties[key].type === 'object') {
                    const obj = {};
                    fieldContainer.querySelectorAll('input, textarea').forEach(input => {
                        const nestedKey = input.previousSibling?.innerText.trim();
                        if (nestedKey) {
                            obj[nestedKey] = input.value;
                        }
                    });
                    data[key] = obj;
                } else {
                    const input = fieldContainer.querySelector('input, textarea');
                    if (input) {
                        data[key] = input.value;
                    }
                }
            }
        }
        localStorage.setItem('data', JSON.stringify(data));
        alert('Dados salvos com sucesso!');
    }

    // Função para baixar os dados como JSON
    function downloadData() {
        const data = JSON.parse(localStorage.getItem('data')) || {};
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Função para carregar um arquivo JSON
    function uploadData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = JSON.parse(e.target.result);
                localStorage.setItem('data', JSON.stringify(data));
                location.reload();
            };
            reader.readAsText(file);
        }
    }

    saveButton.addEventListener('click', saveData);
    downloadButton.addEventListener('click', downloadData);
    uploadInput.addEventListener('change', uploadData);

    loadData();
});