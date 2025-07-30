AFRAME.registerComponent('flickable', {
  init: function () {
    let el = this.el;
    let start = null;

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        start = e.touches[0];
      }
    });

    window.addEventListener('touchend', (e) => {
      if (!start) return;

      let end = e.changedTouches[0];
      let dx = end.clientX - start.clientX;
      let dy = end.clientY - start.clientY;

      if (Math.abs(dy) > 30 && Math.abs(dy) > Math.abs(dx)) {
        const camera = document.querySelector('[camera]').object3D;
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.multiplyScalar(-2);

        // Directly set velocity using Cannon.js API
        if (el.body) {
          el.body.velocity.set(forward.x, forward.y, forward.z);
        } else {
          console.warn('Physics body not yet initialized.');
        }
      }
      start = null;
    });
  }
});

AFRAME.registerComponent('collision-listener', {
    init: function () {
        this.el.addEventListener('collide', (e) => {
            console.log('Ball collided with:', e.detail.body.el);

            // Optional: check if the object hit is the hoop
            if (e.detail.body.el && e.detail.body.el.id === 'hoop-collider') {
                console.log('Ball hit the hoop!');
                this.el.setAttribute('material', 'color', 'red');
            }
        });
    }
});

// Wait for scene to load to attach the listener
document.addEventListener('DOMContentLoaded', () => {
    const ball = document.querySelector('#ball');
    ball.setAttribute('collision-listener', '');
});

AFRAME.registerComponent('follow-marker', {
    tick: function () {
        const marker = document.querySelector('#marker');
        const markerObject3D = marker.object3D;
        const collider = this.el.object3D;

        // Copy position and rotation
        collider.position.copy(markerObject3D.position);
        collider.rotation.copy(markerObject3D.rotation);
    }
});
