import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { DragControls } from "three/addons";
import Stats from "three/addons/libs/stats.module.js";

if (WebGL.isWebGL2Available()) {
  function firstExampleMesh() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const app = document.querySelector("#app");
    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    app.append(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  }
  function secondExampleLines() {
    const app = document.querySelector("#app");
    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    app.append(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500,
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 5, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.LineLoop(geometry, material);
    scene.add(line);
    function animate() {
      requestAnimationFrame(animate);
      line.rotation.x += 0.01;
      line.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  }
  function exampleText() {
    [
      { nameId: "#surname", nameInput: "#surnameInput" },
      { nameId: "#name", nameInput: "#nameInput" },
    ].forEach(({ nameId, nameInput }) => {
      createAnimationText({ nameId, nameInput });
    });

    function createText() {
      const loader = new FontLoader();
      loader.load("font/font.typeface.json", function (font) {
        const color = "white";

        const matDark = new THREE.LineBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
        });

        const matLite = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        });

        const message = "HELLO";
        const shapes = font.generateShapes(message, 100);

        const geometry = new THREE.ShapeGeometry(shapes);

        geometry.computeBoundingBox();

        const xMid =
          -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        geometry.translate(xMid, 0, 0);

        const text = new THREE.Mesh(geometry, matLite);
        text.position.z = -10;
        scene.add(text);

        const holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              const hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        shapes.push.apply(shapes, holeShapes);

        const lineText = new THREE.Object3D();

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          const points = shape.getPoints();
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          geometry.translate(xMid, 0, 0);

          const lineMesh = new THREE.Line(geometry, matDark);
          lineText.add(lineMesh);
        }

        scene.add(lineText);
      }); //end load function
    }

    function createAnimationText({ nameId, nameInput }) {
      const handleInput = document.querySelector(nameInput);
      let camera,
        scene,
        renderer,
        text,
        lineText,
        myMessage = "Пиши текст",
        controls;

      handleInput.addEventListener("input", (el) => {
        scene.clear();
        myMessage = el.target.value;
        createText();
      });

      init();

      function createText() {
        const loader = new FontLoader();
        loader.load("font/font.typeface.json", function (font) {
          const color = "white";

          const matDark = new THREE.LineBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
          });

          const matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          });

          const message = myMessage;
          const shapes = font.generateShapes(message, 100);

          const geometry = new THREE.ShapeGeometry(shapes);

          geometry.computeBoundingBox();

          const xMid =
            -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

          geometry.translate(xMid, 0, 0);

          text = new THREE.Mesh(geometry, matLite);
          text.position.z = -10;
          scene.add(text);

          const holeShapes = [];

          for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];

            if (shape.holes && shape.holes.length > 0) {
              for (let j = 0; j < shape.holes.length; j++) {
                const hole = shape.holes[j];
                holeShapes.push(hole);
              }
            }
          }

          shapes.push.apply(shapes, holeShapes);

          lineText = new THREE.Object3D();

          for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];

            const points = shape.getPoints();
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            geometry.translate(xMid, 0, 0);

            const lineMesh = new THREE.Line(geometry, matDark);
            lineText.add(lineMesh);
          }

          scene.add(lineText);
        }); //end load function
      }

      function init() {
        camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth / window.innerHeight,
          1,
          10000,
        );
        camera.position.set(0, 0, 600);

        scene = new THREE.Scene();
        scene.background = new THREE.Color("black");

        createText();

        const app = document.querySelector(nameId);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        app.append(renderer.domElement);

        // controls = new OrbitControls( camera, renderer.domElement );
        // controls.target.set( 0, 0, 0 );
        // controls.listenToKeyEvents( window ); // optional
        // controls.keys = {
        //     LEFT: 'ArrowLeft', //left arrow
        //     UP: 'ArrowUp', // up arrow
        //     RIGHT: 'ArrowRight', // right arrow
        //     BOTTOM: 'ArrowDown' // down arrow
        // }
        //
        // controls.dampingFactor = 0.05;
        //
        // controls.screenSpacePanning = false;
        //
        // controls.minDistance = 500;
        // controls.maxDistance = 2000;
        //
        // controls.maxPolarAngle = Math.PI / 2;

        window.addEventListener("resize", onWindowResize);
      } // end init

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function animate() {
        requestAnimationFrame(animate);
        text.rotation.y += 0.001;
        lineText.rotation.y += 0.001;
        controls.update();
        renderer.render(scene, camera);
      }

      animate();
    }
  }
  // exampleText()

  // function main() {
  //     const canvas = document.querySelector( '#c' );
  //     const renderer = new THREE.WebGLRenderer( { antialias: true, canvas, alpha: true } );
  //     let INTERSECTED;
  //     function makeScene( elem, group ) {
  //         const scene = new THREE.Scene();
  //         const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
  //         camera.position.set( 0, 0, 500 );
  //         camera.lookAt( 0, 0, 0 );
  //
  //         const color = 0xFFFFFF;
  //         const intensity = 3;
  //         const light = new THREE.DirectionalLight( color, intensity );
  //         light.position.set( - 1, 2, 4 );
  //         scene.add( light );
  //
  //
  //         const dragControl = new DragControls(group, camera, elem)
  //         const raycaster = new THREE.Raycaster();
  //         let pointer = new THREE.Vector2();
  //         const stats = new Stats();
  //         document.body.appendChild( stats.dom );
  //         document.addEventListener( 'mousemove', (event) => {
  //             // console.log(event)
  //             pointer.x = (event.clientX / window.innerWidth) * 2 -1;
  //             pointer.y = (event.clientY / window.innerHeight) * 2 + 1;
  //         } );
  //         // const controls = new OrbitControls(camera, elem);
  //         // controls.dampingFactor = 0.05;
  //         // controls.screenSpacePanning = false;
  //         // controls.minDistance = 500;
  //         // controls.maxDistance = 650;
  //         // controls.maxPolarAngle = Math.PI / 2;
  //         // controls.minPolarAngle = Math.PI /2 ;
  //         return { scene, camera, elem, dragControl, raycaster, pointer, stats};
  //     }
  //
  //     function createText ({name, textMain}) {
  //         const loader = new FontLoader();
  //         const group = new THREE.Group();
  //         const objects = [];
  //
  //         loader.load( 'font/font.typeface.json', function ( font ) {
  //                 const color = 'white';
  //
  //                 const matDark = new THREE.LineBasicMaterial( {
  //                     color: color,
  //                     side: THREE.DoubleSide
  //                 } );
  //
  //                 const matLite = new THREE.MeshBasicMaterial( {
  //                     color: color,
  //                     transparent: true,
  //                     opacity: 0.4,
  //                     side: THREE.DoubleSide
  //                 } );
  //
  //                 const message = textMain;
  //                 const shapes = font.generateShapes( message, 100 );
  //
  //                 const geometry = new THREE.ShapeGeometry( shapes );
  //
  //                 geometry.computeBoundingBox();
  //
  //                 const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  //
  //                 geometry.translate( xMid, 0, 0 );
  //
  //                 const text = new THREE.Mesh( geometry, matLite );
  //                 text.position.z = 0;
  //
  //                 const holeShapes = [];
  //
  //                 for ( let i = 0; i < shapes.length; i ++ ) {
  //
  //                     const shape = shapes[ i ];
  //
  //                     if ( shape.holes && shape.holes.length > 0 ) {
  //
  //                         for ( let j = 0; j < shape.holes.length; j ++ ) {
  //
  //                             const hole = shape.holes[ j ];
  //                             holeShapes.push( hole );
  //
  //                         }
  //
  //                     }
  //
  //                 }
  //
  //                 shapes.push.apply( shapes, holeShapes );
  //
  //                 const lineText = new THREE.Object3D();
  //
  //                 for ( let i = 0; i < shapes.length; i ++ ) {
  //
  //                     const shape = shapes[ i ];
  //
  //                     const points = shape.getPoints();
  //                     const geometry = new THREE.BufferGeometry().setFromPoints( points );
  //
  //                     geometry.translate( xMid, 0, 0 );
  //
  //                     const lineMesh = new THREE.Line( geometry, matDark );
  //                     lineText.add( lineMesh );
  //                 }
  //
  //                 group.add(text);
  //                 group.add(lineText);
  //                 objects.push(text);
  //                 objects.push(lineText)
  //             }
  //         );
  //
  //         const sceneInfo = makeScene(document.querySelector(name), group);
  //         sceneInfo.scene.add(group);
  //         sceneInfo.mesh = group;
  //         return sceneInfo;
  //     }
  //
  //     function setupScene1(textMain = 'фамилия') {
  //         return createText({name: '#surname', textMain: textMain})
  //     }
  //
  //     function setupScene2(textMain = 'Имя') {
  //         return createText({name: '#name', textMain: textMain});
  //     }
  //
  //     const sceneInfo1 = setupScene1();
  //     const sceneInfo2 = setupScene2();
  //
  //     function resizeRendererToDisplaySize( renderer ) {
  //         const canvas = renderer.domElement;
  //         const width = canvas.clientWidth;
  //         const height = canvas.clientHeight;
  //         const needResize = canvas.width !== width || canvas.height !== height;
  //         if ( needResize ) {
  //             renderer.setSize( width, height, false );
  //         }
  //
  //         return needResize;
  //
  //     }
  //
  //     function renderSceneInfo( sceneInfo ) {
  //         const { scene, camera, elem,  mesh, dragControl, raycaster, pointer, stats } = sceneInfo;
  //         // console.log(scene)
  //         const { left, right, top, bottom, width, height } =
  //             elem.getBoundingClientRect();
  //
  //         const isOffscreen =
  //             bottom < 0 ||
  //             top > renderer.domElement.clientHeight ||
  //             right < 0 ||
  //             left > renderer.domElement.clientWidth;
  //
  //         if ( isOffscreen ) {
  //             return;
  //         }
  //
  //         camera.aspect = width / height;
  //         camera.updateProjectionMatrix();
  //
  //         const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
  //         renderer.setScissor( left, positiveYUpBottom, width, height );
  //         renderer.setViewport( left, positiveYUpBottom, width, height );
  //
  //         raycaster.setFromCamera( pointer, camera );
  //         if (scene.children?.[1].children) {
  //         const intersects = raycaster.intersectObjects( scene.children[1].children, false );
  //             if ( intersects.length > 0 ) {
  //                 alert('YPA')
  //                 if ( INTERSECTED != intersects[ 0 ].object ) {
  //                     if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
  //                     INTERSECTED = intersects[ 0 ].object;
  //                     INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
  //                     INTERSECTED.material.emissive.setHex( 0xff0000 );
  //
  //                 }
  //
  //             } else {
  //
  //                 if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
  //
  //                 INTERSECTED = null;
  //
  //             }
  //         }
  //         console.log(pointer)
  //         // controls.update();
  //         stats.update();
  //         mesh.rotation.y += 0.001;
  //         renderer.render( scene, camera );
  //     }
  //
  //     // const inputHandle = document.querySelector('#surnameInput');
  //     // inputHandle.addEventListener('change', el => {
  //     //         const file = this.fi
  //     // })
  //
  //     function render( time ) {
  //         time *= 0.001;
  //         resizeRendererToDisplaySize( renderer );
  //         renderer.setScissorTest( false );
  //         renderer.clear( true, true );
  //         renderer.setScissorTest( true );
  //         renderSceneInfo( sceneInfo1 );
  //         renderSceneInfo( sceneInfo2 );
  //         // if (sceneInfo2.mesh?.rotation) sceneInfo2.mesh.rotation.y = time * .1;
  //         // if (sceneInfo1.mesh?.rotation) sceneInfo1.mesh.rotation.y = time * .1;
  //         requestAnimationFrame( render );
  //     }
  //
  //     render();
  // }
  //
  // main();

  const enable = {
    "#name": false,
    "#surname": false,
  };

  [
    { name: "#name", nameInput: "Введите имя" },
    { name: "#surname", nameInput: "Введите фамилию" },
  ].forEach((i) => raycast(i));
  function raycast(textI) {
    let container;
    let camera, scene, renderer;
    let controls, group;
    let nowText = "";

    const objects = [];

    const mouse = new THREE.Vector2(),
      raycaster = new THREE.Raycaster();

    init();

    function createText(textItem = textI.nameInput) {
      const loader = new FontLoader();
      loader.load("font/font.typeface.json", function (font) {
        const mainGroup = new THREE.Group();
        const color = "white";
        const matDark = new THREE.LineBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
        });

        const matLite = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        });

        const message = textItem;
        const shapes = font.generateShapes(message, 25);

        const geometry = new THREE.ShapeGeometry(shapes);

        geometry.computeBoundingBox();

        const xMid =
          -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        geometry.translate(xMid, 0, 0);

        const text = new THREE.Mesh(geometry, matLite);
        text.position.z = -10;
        mainGroup.add(text);

        const holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              const hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        shapes.push.apply(shapes, holeShapes);

        const lineText = new THREE.Mesh();

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          const points = shape.getPoints();
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          geometry.translate(xMid, 0, 0);

          const lineMesh = new THREE.Line(geometry, matDark);
          lineText.add(lineMesh);
        }

        scene.add(mainGroup);
        mainGroup.add(lineText);
        objects.push(mainGroup);
      }); //end load function
    }
    function init() {
      container = document.createElement("div");
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(
        25,
        window.innerWidth / window.innerHeight,
        1,
        10000,
      );
      camera.position.set(0, -70, 600);
      scene = new THREE.Scene();
      scene.background = new THREE.Color("black");

      scene.add(new THREE.AmbientLight(0xaaaaaa));

      const light = new THREE.SpotLight(0xffffff, 10000);
      light.position.set(0, 25, 50);
      light.angle = Math.PI / 9;

      light.castShadow = true;
      light.shadow.camera.near = 10;
      light.shadow.camera.far = 100;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;

      scene.add(light);

      group = new THREE.Group();
      scene.add(group);

      createText();

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      const fff = document.querySelector(textI.name);
      fff.appendChild(renderer.domElement);

      controls = new DragControls([...objects], camera, renderer.domElement);

      controls.addEventListener("dragstart", onClickDrag);

      window.addEventListener("resize", onWindowResize);
      document.addEventListener("keypress", onDocumentKeyDown, false);
      document.addEventListener("keydown", onRemoveDown, false);
      document.addEventListener("click", onClick);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    function onClickDrag() {
      objects.length = 0;
      scene.clear();
      enable["#name"] = false;
      enable["#surname"] = false;
      enable[textI.name] = true;
      createText(nowText);
    }

    function onRemoveDown(event) {
      if (enable[textI.name]) {
        if (event.key === "Backspace") {
          nowText = nowText.slice(0, nowText.length - 1);
          scene.clear();
          createText(nowText);
        }
      }
    }
    function onDocumentKeyDown(event) {
      if (enable[textI.name]) {
        nowText = nowText + event.key;
        objects.length = 0;
        scene.clear();
        createText(nowText);
      }
    }

    function onClick(event) {
      if (event.target.nodeName !== "CANVAS") {
        enable["#name"] = false;
        enable["#surname"] = false;
      }
      event.preventDefault();
      const draggableObjects = controls.getObjects();
      draggableObjects.length = 0;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersections = raycaster.intersectObjects(objects[0], true);
      controls.transformGroup = true;
      draggableObjects.push(objects[0]);
      render();
    }

    function render() {
      renderer.render(scene, camera);
    }
    function animate() {
      requestAnimationFrame(animate);
      if (objects[0]?.rotation) {
        objects[0].rotation.y += 0.001;
      }

      if (enable[textI.name]) {
        scene.background = new THREE.Color("#1E1E1E");
      } else {
        scene.background = new THREE.Color("black");
      }
      render();
    }

    animate();
  }

  function space() {
    let renderer,
      scene,
      camera,
      sphereBg,
      nucleus,
      stars,
      controls,
      container = document.getElementById("space"),
      timeout_Debounce,
      // noise = new SimplexNoise(),
      cameraSpeed = 0,
      blobScale = 3;

    init();
    animate();

    function init() {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        10,
        window.innerWidth / window.innerHeight,
        0.01,
        1000,
      );
      camera.position.set(0, 0, 230);

      let directionalLight = new THREE.DirectionalLight("#fff", 2);
      directionalLight.position.set(0, 50, -20);
      scene.add(directionalLight);

      let ambientLight = new THREE.AmbientLight("#ffffff", 1);
      ambientLight.position.set(0, 20, 20);
      scene.add(ambientLight);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      //OrbitControl
      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.enablePan = false;
      controls.enabped = false;
      controls.enableZoom = false;

      const loader = new THREE.TextureLoader();
      const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
      const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");
      const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
      const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");
      /*    Moving Stars   */
      let starsGeometry = new THREE.BufferGeometry();
      let positions = [];

      for (let i = 0; i < 10; i++) {
        let particleStar = randomPointSphere(200);

        particleStar.velocity = THREE.MathUtils.randInt(550, 10);

        particleStar.startX = particleStar.x;
        particleStar.startY = particleStar.y;
        particleStar.startZ = particleStar.z;
        positions.push(particleStar.x, particleStar.y, particleStar.z);
      }
      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      let starsMaterial = new THREE.PointsMaterial({
        size: 100,
        color: "white",
        transparent: true,
        opacity: 0.5,
        map: textureStar,
        blending: THREE.AdditiveBlending,
      });
      starsMaterial.depthWrite = false;
      stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      /*    Fixed Stars   */
      function createStars(texture, size, total) {
        let pointGeometry = new THREE.BufferGeometry();
        let positions = [];

        for (let i = 0; i < total; i++) {
          let radius = THREE.MathUtils.randInt(149, 70);
          let particles = randomPointSphere(radius);
          positions.push(particles.x, particles.y, particles.z);
        }

        pointGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );

        let pointMaterial = new THREE.PointsMaterial({
          size: size,
          map: texture,
          blending: THREE.AdditiveBlending,
        });

        return new THREE.Points(pointGeometry, pointMaterial);
      }
      scene.add(createStars(texture1, 15, 200));
      scene.add(createStars(texture2, 5, 50));
      scene.add(createStars(texture4, 7, 25));

      function randomPointSphere(radius) {
        let theta = 2 * Math.PI * Math.random();
        let phi = Math.acos(2 * Math.random() - 1);
        let dx = 0 + radius * Math.sin(phi) * Math.cos(theta);
        let dy = 0 + radius * Math.sin(phi) * Math.sin(theta);
        let dz = 0 + radius * Math.cos(phi);
        return new THREE.Vector3(dx, dy, dz);
      }
    } // INIT
    function animate() {
      controls.update();
      stars.geometry.verticesNeedUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    } // animate

    /*     Resize     */
    window.addEventListener("resize", () => {
      clearTimeout(timeout_Debounce);
      timeout_Debounce = setTimeout(onWindowResize, 80);
    });
    function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    } // resize
  } // END

  space();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}
