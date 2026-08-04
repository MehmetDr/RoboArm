<template>
  <div style="position: absolute; z-index: 10; padding: 20px; background: rgba(0,0,0,0.8); color: #00ffcc; border-radius: 8px; margin: 15px; font-family: monospace; width: 450px;">
    <h3 style="margin-top: 0; border-bottom: 1px solid #00ffcc; padding-bottom: 10px;">ROBOT KONTROL PANELİ</h3>
    
    <div v-for="(joint, index) in jointConfigs" :key="joint.id" style="margin-bottom: 15px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">
        {{ joint.label }} (Eksen: {{ joint.axis.toUpperCase() }})
      </label>
      
      <div style="display: flex; align-items: center; gap: 10px;">
        <input 
          type="range" 
          :min="joint.min" 
          :max="joint.max" 
          step="0.01" 
          v-model="jointAngles[index]" 
          @input="updateJoints" 
          style="flex-grow: 1;"
        />
        <span style="width: 45px; text-align: right;">{{ parseFloat(jointAngles[index]).toFixed(2) }}</span>
      </div>
    </div>
  </div>
  
  <div ref="canvasContainer" style="width: 100vw; height: 100vh; overflow: hidden;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvasContainer = ref(null);

// SENİN BELİRLEDİĞİN KESİN EKSENLER VE 5 ANA PARÇA
const jointConfigs = ref([
  { id: 'Bone_01', label: '1. Taban (Base)', axis: 'y', min: -3.14, max: 3.14 },
  { id: 'Bone001_02', label: '2. Omuz (Shoulder)', axis: 'y', min: -1.5, max: 1.5 },
  { id: 'Bone002_03', label: '3. Dirsek (Elbow)', axis: 'y', min: -2.0, max: 2.0 },
  { id: 'Bone004_05', label: '4. Bilek Dönüşü (Wrist)', axis: 'y', min: -3.14, max: 3.14 },
  { id: 'CLAW_GROUP', label: '5. Pençe (Aç/Kapat)', axis: 'x', isClaw: true, min: -0.8, max: 0.0 } 
]);

const jointAngles = ref(jointConfigs.value.map(() => 0));
const boneRefs = [];

onMounted(() => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvasContainer.value.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load('/scene.gltf', (gltf) => {
    const robot = gltf.scene;
    scene.add(robot);

    jointConfigs.value.forEach((config, index) => {
      if (config.isClaw) {
        const leftBone = robot.getObjectByName('arn007l_023');
        const rightBone = robot.getObjectByName('arn007r_00');
        
        boneRefs[index] = { left: leftBone, right: rightBone };

        if (leftBone) leftBone.userData.initialRotation = { x: leftBone.rotation.x, y: leftBone.rotation.y, z: leftBone.rotation.z };
        if (rightBone) rightBone.userData.initialRotation = { x: rightBone.rotation.x, y: rightBone.rotation.y, z: rightBone.rotation.z };
      } else {
        const bone = robot.getObjectByName(config.id);
        if (bone) {
          boneRefs[index] = bone;
          bone.userData.initialRotation = { x: bone.rotation.x, y: bone.rotation.y, z: bone.rotation.z };
        }
      }
    });
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});

// Açıları güncelleyen ana fonksiyon
const updateJoints = () => {
  jointConfigs.value.forEach((config, index) => {
    const angle = parseFloat(jointAngles.value[index]);

    if (config.isClaw) {
      const bones = boneRefs[index];
      if (bones && bones.left && bones.right) {
        // Pençe kemiklerini orijinal pozisyonuna sıfırla
        bones.left.rotation.set(bones.left.userData.initialRotation.x, bones.left.userData.initialRotation.y, bones.left.userData.initialRotation.z);
        bones.right.rotation.set(bones.right.userData.initialRotation.x, bones.right.userData.initialRotation.y, bones.right.userData.initialRotation.z);
        
        // Zıt yönlü hareket (X ekseninde eksi olarak ilerleyecek)
        bones.left.rotation[config.axis] += angle;
        bones.right.rotation[config.axis] += angle; 
      }
    } else {
      const bone = boneRefs[index];
      if (bone && bone.userData.initialRotation) {
        // Normal kemikleri orijinal pozisyonuna sıfırla
        bone.rotation.set(bone.userData.initialRotation.x, bone.userData.initialRotation.y, bone.userData.initialRotation.z);
        
        // Yeni açıyı ekle
        bone.rotation[config.axis] += angle;
      }
    }
  });
};
</script>

<style>
body { margin: 0; padding: 0; overflow: hidden; }
</style>