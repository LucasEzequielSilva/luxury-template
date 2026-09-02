# Workflows n8n para iPhone Luxury

## 🤖 WhatsApp Assistant con Claude

Asistente inteligente que responde consultas de clientes automáticamente usando Claude Sonnet.

### ✨ Qué hace:

1. **Recibe consulta** del cliente por webhook
2. **Obtiene cotización** del dólar blue en tiempo real
3. **Claude analiza** el mensaje y genera respuesta personalizada
4. **Devuelve respuesta** con precios en USD y ARS
5. **Guarda en Google Sheets** para CRM (opcional)

---

## 📋 Instrucciones de Instalación

### 1. Importar el workflow en n8n

1. Abrí n8n: http://localhost:5678
2. Click en **"Workflows"** → **"Add workflow"** → **"Import from File"**
3. Seleccioná: `D:\Dev\trendspot\n8n-workflows\trendspot-whatsapp-assistant.json`
4. Click en **"Import"**

### 2. Configurar credenciales

#### a) API de Anthropic (Claude)

1. Conseguí tu API Key en: https://console.anthropic.com/settings/keys
2. En n8n: Click en el nodo **"Claude - Generar Respuesta"**
3. Click en **"Credential to connect with"** → **"Create New"**
4. Tipo: **"Anthropic API"**
5. Pegá tu API Key
6. Guardá

#### b) Google Sheets (opcional - para CRM)

1. En n8n: Click en el nodo **"Guardar en Google Sheets"**
2. Click en **"Credential to connect with"** → **"Create New"**
3. Seguí el flujo OAuth de Google
4. Creá un Google Sheet con estas columnas:
   - Timestamp
   - Telefono
   - Mensaje_Cliente
   - Respuesta_Claude
   - Dolar_Blue
5. Copiá el ID del Sheet (de la URL) y pegalo en el nodo

**Si no querés usar Sheets:** Simplemente desconectá o eliminá el nodo "Guardar en Google Sheets"

### 3. Activar el workflow

1. Click en el toggle **"Active"** arriba a la derecha
2. Copiá la **URL del webhook** (aparece en el nodo "Webhook - Consulta Cliente")

---

## 🧪 Probar el workflow

### Opción A: Desde Postman/Insomnia

```bash
POST http://localhost:5678/webhook/whatsapp-consulta
Content-Type: application/json

{
  "mensaje": "Hola! Cuánto sale el iPhone 15 Pro de 256GB?",
  "telefono": "+5491123456789"
}
```

### Opción B: Desde tu navegador (fetch)

Abrí la consola del navegador en http://localhost:3000 y ejecutá:

```javascript
fetch('http://localhost:5678/webhook/whatsapp-consulta', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mensaje: 'Quiero un iPhone 16 Pro Max',
    telefono: '+5491123456789'
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

### Opción C: Con curl

```bash
curl -X POST http://localhost:5678/webhook/whatsapp-consulta \
  -H "Content-Type: application/json" \
  -d '{
    "mensaje": "Tienen iPhone 14 en stock?",
    "telefono": "+5491123456789"
  }'
```

---

## 🔗 Integración con WhatsApp Business

Para conectarlo con WhatsApp Business API necesitás:

1. **Twilio** (más fácil): https://www.twilio.com/whatsapp
2. **Meta Business** (oficial): https://business.whatsapp.com/
3. **Alternativa local:** Usar **whatsapp-web.js** con Node.js

### Ejemplo con Twilio:

1. Creá cuenta en Twilio
2. Activá WhatsApp Sandbox
3. Configurá webhook de Twilio para apuntar a tu n8n
4. Modificá el workflow para parsear el formato de Twilio:

```javascript
// En el nodo "Parse Input" cambiar a:
mensaje_cliente: {{ $json.Body }}
telefono_cliente: {{ $json.From }}
```

---

## 💡 Personalizaciones

### Cambiar el modelo de Claude

En el nodo "Claude - Generar Respuesta" → Model:
- `claude-opus-4-20250514` (más inteligente, más lento)
- `claude-sonnet-4-20250514` (balanceado) ← **default**
- `claude-haiku-3-5-20241022` (más rápido, más barato)

### Ajustar el tono/estilo

Editá el prompt en el nodo "Claude - Generar Respuesta":
- Hacelo más formal/informal
- Agregá más emojis o menos
- Cambiá el largo de las respuestas (maxTokens)

### Actualizar catálogo

Cuando agregues productos nuevos:
1. Editá el nodo "Claude - Generar Respuesta"
2. Actualizá la sección **CATÁLOGO DISPONIBLE**
3. Guardá el workflow

---

## 📊 Otros workflows que podés crear

### 1. **Auto-Update Inventory** (próximamente)
Actualiza productos desde Google Sheets → Genera archivo TypeScript → Deploy automático

### 2. **Competitor Price Monitor** (próximamente)
Scrapea precios de competidores → Compara → Alerta si hay oportunidades

### 3. **Content Generator** (próximamente)
Claude genera posts de Instagram + captions para nuevos productos

### 4. **Dollar Alert** (próximamente)
Monitorea dólar blue → Si sube >5% → Notifica para ajustar precios

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
→ Verificá que tu API Key de Anthropic esté bien configurada

### Error: "Webhook not found"
→ Asegurate que el workflow esté **Active** (toggle arriba a la derecha)

### El dólar no se actualiza
→ Verificá que http://localhost:3000/api/dolar esté funcionando
→ Alternativa: Usá otra API como https://dolarapi.com/

### Claude responde raro
→ Ajustá el prompt
→ Bajá la temperatura (más conservador) o subila (más creativo)

---

## 💰 Costos estimados

**Claude Sonnet (precios Anthropic):**
- Input: $3 por millón de tokens
- Output: $15 por millón de tokens

**Estimado por consulta:**
- ~800 tokens input (prompt + catálogo)
- ~150 tokens output (respuesta)
- **Costo: ~$0.005 por consulta** (medio centavo de dólar)

**100 consultas/día = $0.50/día = $15/mes**

Súper barato para la automatización que te da.

---

## 🚀 Próximos pasos

1. ✅ Importar workflow
2. ✅ Configurar Claude API
3. ✅ Probar con mensaje de prueba
4. ⬜ Integrar con WhatsApp Business
5. ⬜ Configurar Google Sheets CRM
6. ⬜ Crear workflows adicionales (monitor de precios, generador de contenido)

---

¿Dudas? El workflow tiene comentarios en cada nodo.
