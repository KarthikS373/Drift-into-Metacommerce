import machine from "./LoopMachine.js";

class Animator {
  constructor(mesh) {
    this.mesh = mesh;
    this.mixer = new THREE.AnimationMixer(mesh);
    this.clock = new THREE.Clock();
    this.clips = mesh.animations.map((animation) => {
      return this.mixer.clipAction(animation);
    });
    this.lastClip = null;
    this.interpolationTime = 0.2;
    this.inProgress = false;
  }

  run() {
    this.mixer.update(this.clock.getDelta());
  }

  start() {
    machine.addCallback(this.run.bind(this));
  }

  stop() {
    machine.removeCallback(this.run.bind(this));
  }

  onCycleFinished() {
    this.inProgress = false;
  }

  action(animationID, timeLapse, flag) {
    if (this.inProgress) return;
    if (flag) {
      this.mixer.addEventListener("loop", this.onCycleFinished.bind(this));
      this.inProgress = true;
    }
    this.mixer.timeScale = timeLapse;
    if (this.lastClip === null) {
      this.clips[animationID].play();
      this.lastClip = animationID;
      return;
    }
    if (this.lastClip == animationID) {
      return;
    }
    this.clips[animationID].reset();
    this.clips[animationID].play();
    this.clips[this.lastClip].crossFadeTo(
      this.clips[animationID],
      this.interpolationTime,
      true
    );
    this.lastClip = animationID;
  }
}
export default Animator;
