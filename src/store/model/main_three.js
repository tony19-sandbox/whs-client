import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    FogExp2,
    CylinderBufferGeometry,
    MeshPhongMaterial,
    Mesh,
    DirectionalLight,
    AmbientLight,
    // LineBasicMaterial,
    // BufferGeometry,
    // Vector3,
    // Line
  } from 'three'


export default {
  namespaced: true,

  state: () => ({
    width: 0,
    height: 0,
    camera: null,
    controls: null,
    scene: null,
    renderer: null,
  //   axisLines: [],
    pyramids: []
  }),

  mutations: {
    SET_VIEWPORT_SIZE(state, {width, height}){
      state.width = width;
      state.height = height;
      },
    INITIALIZE_RENDERER(state, el){
        state.renderer = new WebGLRenderer({ antialias: true });
        state.renderer.setPixelRatio(window.devicePixelRatio);
        state.renderer.setSize(state.width, state.height);
        el.appendChild(state.renderer.domElement); // dodajemy canvas stworzony przez WebGL do DOM Tree, używamy el (jako skrót od element), który jest rodzicem dodawanego elementu
      },
    INITIALIZE_CAMERA(state){
        state.camera = new PerspectiveCamera(60, state.width/state.height, 1, 1000);
        state.camera.position.set(0,0,500);
      },
    INITIALIZE_CONTROLS(state){
        state.controls = new TrackballControls(state.camera, state.renderer.domElement); // przekazanie domElement sprawia, że ograniczamy TrackballControls do działania tylko w obrębie canvasa a nie całego dokumentu
        state.controls.rotateSpeed = 1.0;
        state.controls.zoomSpeed = 1.2;
        state.controls.panSpeed = 0.8;
        state.controls.noZoom = false;
        state.controls.noPan = false;
        state.controls.staticMoving = true;
        state.controls.dynamicDampingFactor = 0.3;
      },
    INITIALIZE_SCENE(state){
        state.scene = new Scene();
        state.scene.background = new Color(0xcccccc);
        state.scene.fog = new FogExp2(0xcccccc, 0.002); // dodajemy mgłę - im dalej są obiekty tym bardziej zamglone

        // create geometry and add mesh collection to an array
        var geometry = new CylinderBufferGeometry(0,10,30,4,1);
        var material = new MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true
        });

        for(var i = 0; i < 500; i++){
            var mesh = new Mesh(geometry, material);
            mesh.position.x = (Math.random() - 0.5) * 1000;
            mesh.position.y = (Math.random() - 0.5) * 1000;
            mesh.position.z = (Math.random() - 0.5) * 1000;
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            state.pyramids.push(mesh); // dodajemy każdą piramidę do arraya
        };

        state.scene.add(...state.pyramids); // dodajemy obiekty do sceny


        // create lights
        var lightA = new DirectionalLight(0xffffff);
        lightA.position.set(1,1,1);
        state.scene.add(lightA);
        var lightB = new DirectionalLight(0x002288);
        lightB.position.set(-1, -1, -1);
        state.scene.add(lightB);
        var lightC = new AmbientLight(0x222222);
        state.scene.add(lightC);

        // create axes
        // var materialLine1 = new LineBasicMaterial({ color: 0x0000ff });
        // var geometryLine1 = new BufferGeometry();
        // geometryLine1.vertices.push(new Vector3(0,0,0));
        // geometryLine1.vertices.push(new Vector3(0,1000,0));
        // var lineA = new Line(geometryLine1, materialLine1);
        // state.axisLines.push(lineA);

        // var materialLine2 = new LineBasicMaterial({ color: 0x00ff00 });
        // var geometryLine2 = new BufferGeometry();
        // geometryLine2.vertices.push(new Vector3(0,0,0));
        // geometryLine2.vertices.push(new Vector3(1000,0,0));
        // var lineB = new Line(geometryLine2, materialLine2);
        // state.axisLines.push(lineB);

        // var materialLine3 = new LineBasicMaterial({ color: 0xff0000 });
        // var geometryLine3 = new BufferGeometry();
        // geometryLine3.vertices.push(new Vector3(0,0,0));
        // geometryLine3.vertices.push(new Vector3(0,0,1000));
        // var lineC = new Line(geometryLine3, materialLine3);
        // state.axisLines.push(lineC);

        // state.scene.add(...state.axisLines);
      },
    RESIZE(state, {width, height}){
        state.width = width;
        state.height = height;
        state.camera.aspect = width/height;
        state.camera.updateProjectionMatrix();
        state.renderer.setSize(width, height);
        state.controls.handleResize(); // to jest metoda dostępna dla TrackballControls
        state.renderer.render(state.scene, state.camera);
    }
  },

  actions: {
    // funkcja ta zwraca promise jak tylko wykonają się wszystkie mutacje. Tutaj też ustawiamy początkowe renderowanie sceny i rerenderowanie przy zmianie controls (orbity)
    INIT({ commit, state }, { width, height, el}){
      return new Promise(resolve => {
        commit("SET_VIEWPORT_SIZE", { width, height });
        commit("INITIALIZE_RENDERER", el);
        commit("INITIALIZE_CAMERA");
        commit("INITIALIZE_CONTROLS");
        commit("INITIALIZE_SCENE");

        // initial scene rendering
        state.renderer.render(state.scene, state.camera);

        // add event listener that will re-render the scene when the controls are changed
        state.controls.addEventListener("change", () => {
            state.renderer.render(state.scene, state.camera);
        });

        resolve(); // resolve zwraca Promise (jak wszyskie commity się wykonają w promisie)
      });
    },
  // tutaj ustawiamy animation loop. Funkcja rerenderuje scenę (jeśli trzeba)
  // w tej funkcji nie dajmey na końcu  state.renderer.render(state.scene, state.camera); bo w komponencie BaseModel wywołujemy funkcję animate, po której wywołujemy addEventListenera wywołującego jako callback mutację RESIZE przy każdym wydarzeniu 'resize'. W tym RESIZE jest właśnie renderowanie sceny
  ANIMATE({ dispatch, state }){
      window.requestAnimationFrame(() => {
          dispatch("ANIMATE");
          state.controls.update();
      });
  }
},

  getters: {
    dims: (state) => {
      return state.width
    }
  }
};




