---
name: security
description: "Revisar segurança frontend: XSS/CSRF, cookies, headers, minimização de dados, armazenamento e integração com backend. Usar ao tratar CPF, sessão, formulários, consentimento e reCAPTCHA."
---

# Segurança frontend

1. Ler contratos e separar fronteiras navegador/servidor antes de sugerir solução. Confirmar stack e controles existentes.
2. Minimizar dados: não persistir CPF, credenciais ou tokens no navegador por conveniência. localStorage e sessionStorage são acessíveis por JavaScript e XSS; criptografar com chave entregue ao cliente não remove esse risco.
3. Para sessão baseada em cookie, definir HttpOnly, Secure e SameSite no servidor conforme fluxo. JavaScript não define HttpOnly. Validar proteção CSRF e autorização no backend; SameSite isoladamente não comprova proteção completa.
4. Manter…4536 tokens truncated…emplates/skill.template.md"
    },
    {
      "kind": "templates",
      "id": "web-agents",
      "name": "web-agents",
      "description": null,
      "source": "resources/frontend/templates/web-agents.template.md"
    },
    {
      "kind": "templates",
      "id": "web-instructions",
      "name": "web-instructions",
      "description": null,
      "source": "resources/frontend/templates/web-instructions.template.md"
    },
    {
      "kind": "skills",
      "id": "gitlab-delivery",
      "name": "gitlab-delivery",
      "description": "Revisar merge requests, pipelines GitLab CI e entrega Jenkins. Usar para CI/CD, diffs de MR, evidências de validação e integração de checks.",
      "source": "tooling/web-code-reviewer/resources/skills/gitlab-delivery"
    },
    {
      "kind": "skills",
      "id": "rdm-description",
      "name": "rdm-description",
      "description": "Gera descrição de RDM (Requisição de Mudança) a partir de uma branch git. Use quando criar RDM, descrever mudança, requisição de mudança, change request, mudança de infra, mudança de código, branch feature, histórico git para RDM.",
      "source": "tooling/web-code-reviewer/resources/skills/rdm-description"
    }
  ]
}
