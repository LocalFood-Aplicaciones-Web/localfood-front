<template>
  <div class="calculo-container">
    <!-- Sección de instrucciones -->
    <div class="instrucciones-card">
      <div class="instrucciones-content">
        <h2>Ingrese los datos faltante para hacer el cálculo estimado</h2>
      </div>
    </div>

    <!-- Top 3 de restaurantes -->
    <div class="top3-card">
      <h3 class="top3-title">Top 3</h3>
      <p v-if="!store.calculoRealizado" class="top3-waiting">
        Esperando la iniciación de cálculo para hacer el top
      </p>
      <div v-else class="top3-list">
        <div v-for="(item, index) in store.top3" :key="index" class="top3-item">
          <span class="rank">{{ index + 1 }}-</span>
          <span class="nombre">{{ item.nombre }}</span>
        </div>
      </div>
    </div>

    <!-- Panel de grupo -->
    <div class="grupo-panel">
      <div class="grupo-header">
        <h3>Grupo</h3>
      </div>

      <div class="personas-count">
        <p>Personas: {{ store.personas.length }}</p>
      </div>

      <div class="personas-info">
        <p>Seleccione algunas personas para poder hacer el cálculo, en caso contrario solo se le asignara a usted el cálculo</p>
      </div>

      <div class="personas-list">
        <div v-for="persona in store.personas" :key="persona.id" class="persona-item">
          <img :src="persona.avatar" :alt="persona.nombre" class="avatar" />
          <span class="nombre">{{ persona.nombre }}</span>
          <button @click="store.eliminarPersona(persona.id)" class="btn-eliminar">
            🗑️
          </button>
        </div>
      </div>

      <button @click="mostrarModalAgregarPersona = true" class="btn-agregar-persona">
        Agregar Persona al grupo
      </button>
    </div>

    <!-- Panel de restaurantes -->
    <div class="restaurantes-panel">
      <h3 class="restaurantes-title">Restaurantes</h3>

      <div class="mapa-container">
        <div class="mapa-placeholder">
          <div v-for="rest in store.restaurantes" :key="rest.id" class="marker">
            📍 {{ rest.nombre }}
          </div>
        </div>
      </div>

      <div class="restaurantes-acciones">
        <button @click="mostrarModalAgregarPersona = true" class="btn-accion btn-agregar">
          Agregar Persona al grupo
        </button>
        <button @click="mostrarModalEditarRestaurante = true" class="btn-accion btn-editar">
          Editar Restaurante de comida
        </button>
        <button @click="mostrarModalAgregarPersona = true" class="btn-accion btn-agregar-second">
          Agregar Persona al grupo
        </button>
        <button
          @click="calcular"
          class="btn-calcular"
          :disabled="store.personas.length === 0 || store.restaurantes.length === 0">
          Calcular quitándolos top 3 actuales
        </button>
      </div>
    </div>

    <!-- Sección de notificación y logo KFC -->
    <div class="notificacion-card" v-if="store.calculoRealizado">
      <p class="notificacion-texto">
        Se le notificó a las personas de su grupo los locales los mismos locales calculados por medio de la distancia mínima por cada persona
      </p>
      <div class="kfc-logo">
        <div class="kfc-banner">
          <div class="kfc-red"></div>
          <div class="kfc-image">🍗</div>
          <div class="kfc-red"></div>
        </div>
        <h2 class="kfc-text">KFC</h2>
        <button class="btn-calcular-kfc">Calcular</button>
      </div>
    </div>

    <!-- Modal agregar persona -->
    <transition name="modal">
      <div v-if="mostrarModalAgregarPersona" class="modal-overlay" @click.self="cerrarModalPersona">
        <div class="modal">
          <h3>Agregar Persona al Grupo</h3>
          <input
            v-model="nuevaPersona.nombre"
            placeholder="Nombre completo"
            class="input"
            @keyup.enter="agregarPersona" />
          <input
            v-model="nuevaPersona.latitud"
            placeholder="Latitud (ej: -12.0464)"
            type="number"
            step="any"
            class="input"
            @keyup.enter="agregarPersona" />
          <input
            v-model="nuevaPersona.longitud"
            placeholder="Longitud (ej: -77.0428)"
            type="number"
            step="any"
            class="input"
            @keyup.enter="agregarPersona" />
          <div class="modal-botones">
            <button @click="agregarPersona" class="btn-confirmar">Agregar</button>
            <button @click="cerrarModalPersona" class="btn-cancelar">Cancelar</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal editar restaurantes -->
    <transition name="modal">
      <div v-if="mostrarModalEditarRestaurante" class="modal-overlay" @click.self="cerrarModalRestaurante">
        <div class="modal modal-restaurante">
          <h3>Gestionar Restaurantes</h3>
          <div class="restaurantes-lista">
            <div v-for="rest in store.restaurantes" :key="rest.id" class="restaurante-item">
              <span class="restaurante-nombre">{{ rest.nombre }}</span>
              <span class="restaurante-coords">{{ rest.latitud }}, {{ rest.longitud }}</span>
              <button @click="store.eliminarRestaurante(rest.id)" class="btn-eliminar-small">❌</button>
            </div>
          </div>
          <hr class="divider" />
          <h4>Agregar nuevo restaurante</h4>
          <input
            v-model="nuevoRestaurante.nombre"
            placeholder="Nombre del restaurante"
            class="input" />
          <input
            v-model="nuevoRestaurante.latitud"
            placeholder="Latitud"
            type="number"
            step="any"
            class="input" />
          <input
            v-model="nuevoRestaurante.longitud"
            placeholder="Longitud"
            type="number"
            step="any"
            class="input" />
          <div class="modal-botones">
            <button @click="agregarRestaurante" class="btn-confirmar">Agregar</button>
            <button @click="cerrarModalRestaurante" class="btn-cancelar">Cerrar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCalculoStore } from '../../application/calculo.store'

const store = useCalculoStore()

const mostrarModalAgregarPersona = ref(false)
const mostrarModalEditarRestaurante = ref(false)

const nuevaPersona = ref({ nombre: '', latitud: '', longitud: '' })
const nuevoRestaurante = ref({ nombre: '', latitud: '', longitud: '' })

function agregarPersona() {
  if (!nuevaPersona.value.nombre || !nuevaPersona.value.latitud || !nuevaPersona.value.longitud) {
    alert('Por favor completa todos los campos')
    return
  }

  store.agregarPersona({
    nombre: nuevaPersona.value.nombre,
    latitud: parseFloat(nuevaPersona.value.latitud),
    longitud: parseFloat(nuevaPersona.value.longitud)
  })

  nuevaPersona.value = { nombre: '', latitud: '', longitud: '' }
  mostrarModalAgregarPersona.value = false
}

function agregarRestaurante() {
  if (!nuevoRestaurante.value.nombre || !nuevoRestaurante.value.latitud || !nuevoRestaurante.value.longitud) {
    alert('Por favor completa todos los campos')
    return
  }

  store.agregarRestaurante({
    nombre: nuevoRestaurante.value.nombre,
    latitud: parseFloat(nuevoRestaurante.value.latitud),
    longitud: parseFloat(nuevoRestaurante.value.longitud)
  })

  nuevoRestaurante.value = { nombre: '', latitud: '', longitud: '' }
}

function calcular() {
  const resultado = store.calcularTop3()
  if (!resultado.success) {
    alert(resultado.message)
  }
}

function cerrarModalPersona() {
  mostrarModalAgregarPersona.value = false
  nuevaPersona.value = { nombre: '', latitud: '', longitud: '' }
}

function cerrarModalRestaurante() {
  mostrarModalEditarRestaurante.value = false
  nuevoRestaurante.value = { nombre: '', latitud: '', longitud: '' }
}
</script>

<style scoped>
.calculo-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

/* Sección de instrucciones */
.instrucciones-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 30px;
  padding: 40px 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.instrucciones-content {
  background: linear-gradient(to bottom, #2196f3, #1565c0);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
}

.instrucciones-content h2 {
  color: #ffeb3b;
  font-size: 28px;
  font-weight: bold;
  font-style: italic;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Top 3 */
.top3-card {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%);
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.top3-title {
  background: #ffeb3b;
  color: #000;
  padding: 15px;
  border-radius: 15px;
  text-align: center;
  font-weight: bold;
  font-size: 32px;
  font-style: italic;
  margin: 0 0 20px 0;
}

.top3-waiting {
  color: #000;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  padding: 20px;
}

.top3-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top3-item {
  background: #4caf50;
  padding: 18px 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.rank {
  font-size: 24px;
}

/* Panel de grupo */
.grupo-panel {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 30px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.grupo-header h3 {
  background: white;
  color: #000;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  margin: 0 0 15px 0;
  border: 3px solid #000;
}

.personas-count {
  background: #ffc107;
  color: #000;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 15px;
}

.personas-count p {
  margin: 0;
}

.personas-info {
  background: #ffc107;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  color: #000;
  font-size: 15px;
  font-weight: 500;
}

.personas-info p {
  margin: 0;
}

.personas-list {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.persona-item {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  padding: 15px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid #fff;
}

.persona-item .nombre {
  color: #c3ff00;
  font-weight: bold;
  font-size: 18px;
  flex: 1;
}

.btn-eliminar {
  background: #f44336;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s;
}

.btn-eliminar:hover {
  transform: scale(1.1);
}

.btn-agregar-persona {
  width: 100%;
  background: #f44336;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.btn-agregar-persona:hover {
  transform: translateY(-2px);
}

/* Panel de restaurantes */
.restaurantes-panel {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 30px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.restaurantes-title {
  background: white;
  color: #000;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  margin: 0 0 20px 0;
  border: 3px solid #000;
  font-style: italic;
}

.mapa-container {
  background: #e8e8e8;
  height: 320px;
  border-radius: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.2);
}

.mapa-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #d4d4d4, #f0f0f0);
  padding: 20px;
}

.marker {
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-weight: 600;
}

.restaurantes-acciones {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-accion {
  width: 100%;
  background: #f44336;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.btn-accion:hover {
  transform: translateY(-2px);
}

.btn-calcular {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffeb3b;
  border: none;
  padding: 18px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.btn-calcular:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-calcular:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Notificación y KFC */
.notificacion-card {
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notificacion-texto {
  background: white;
  padding: 20px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 500;
  font-style: italic;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.kfc-logo {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 30px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.kfc-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 20px 40px;
  border-radius: 15px;
  border: 4px solid #e31837;
}

.kfc-red {
  width: 60px;
  height: 80px;
  background: #e31837;
  border-radius: 5px;
}

.kfc-image {
  font-size: 60px;
}

.kfc-text {
  font-size: 48px;
  font-weight: bold;
  color: #000;
  margin: 0;
}

.btn-calcular-kfc {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffeb3b;
  border: none;
  padding: 18px 60px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 35px;
  border-radius: 20px;
  min-width: 450px;
  max-width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  margin: 0 0 25px 0;
  font-size: 24px;
  color: #333;
  text-align: center;
}

.modal h4 {
  margin: 20px 0 15px 0;
  font-size: 18px;
  color: #555;
}

.input {
  width: 100%;
  padding: 14px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #4facfe;
}

.modal-botones {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.btn-confirmar {
  flex: 1;
  background: #4caf50;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-confirmar:hover {
  background: #45a049;
}

.btn-cancelar {
  flex: 1;
  background: #f44336;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-cancelar:hover {
  background: #da190b;
}

.restaurantes-lista {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.restaurante-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  gap: 10px;
}

.restaurante-nombre {
  font-weight: 600;
  flex: 1;
}

.restaurante-coords {
  font-size: 12px;
  color: #666;
}

.btn-eliminar-small {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s;
}

.btn-eliminar-small:hover {
  transform: scale(1.2);
}

.divider {
  border: none;
  border-top: 2px solid #eee;
  margin: 20px 0;
}

/* Animaciones */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .calculo-container {
    grid-template-columns: 1fr;
  }
}
</style>
