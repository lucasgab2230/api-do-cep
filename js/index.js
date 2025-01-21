function limpaFormularioCep() {
    document.querySelector("#cep").value=("");
    document.querySelector("#rua").value=("");
    document.querySelector("#bairro").value=("");
    document.querySelector("#cidade").value=("");
    document.querySelector("#estado").value=("");
    document.querySelector("#ibge").value=("");
}

function meuCallback(conteudo) {
    if(!("erro" in conteudo)) {
        document.querySelector("#rua").value=(conteudo.logradouro);
        document.querySelector("#bairro").value=(conteudo.bairro);
        document.querySelector("#cidade").value=(conteudo.localidade);
        document.querySelector("#estado").value=(conteudo.estado);
        document.querySelector("#ibge").value=(conteudo.ibge);
    } else {
        limpaFormularioCep();
        alert("CEP não encontrado.");
    }
}

function pesquisaCep(valor) {
    var cep = valor.replace(/\D/g, '');

    if(cep != "") {
        var validaCep = /^[0-9]{8}$/;

        if(validaCep.test(cep)) {
            document.querySelector("#rua").value="...";
            document.querySelector("#bairro").value="...";
            document.querySelector("#cidade").value="...";
            document.querySelector("#estado").value="...";
            document.querySelector("#ibge").value="...";

            var script = document.createElement("script");

            script.src = `https://viacep.com.br/ws/${cep}/json/?callback=meuCallback`;

            document.body.appendChild(script);
        } else {
            limpaFormularioCep();
            alert("Formato de CEP inválido.");
        }
    } else {
        limpaFormularioCep();
    }
}

