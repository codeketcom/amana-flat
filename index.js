/*
 * Modern Marzipano Virtual Tour JavaScript
 * Enhanced for premium UI with DaisyUI integration
 */
"use strict";

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // Grab elements from DOM - updated selectors for new UI
  var panoElement = document.querySelector("#pano");
  var sceneNameElement = document.querySelector("#sceneName");
  var sceneListContent = document.querySelector("#sceneListContent");
  var sceneListToggleElement = document.querySelector("#sceneListToggle");
  var sceneListCloseElement = document.querySelector("#sceneListClose");
  var autorotateToggleElement = document.querySelector("#autorotateToggle");
  var autorotateIcon = document.querySelector("#autorotateIcon");
  var fullscreenToggleElement = document.querySelector("#fullscreenToggle");
  var fullscreenIcon = document.querySelector("#fullscreenIcon");
  var scenesContainer = document.querySelector("#scenesContainer");
  var sceneListOverlay = document.querySelector("#sceneListOverlay");
  var instructionOverlay = document.getElementById("instructionOverlay");
  var closeInstruction = document.getElementById("closeInstruction");

  // Welcome screen elements
  var welcomeScreen = document.getElementById("welcomeScreen");
  var startTourBtn = document.getElementById("startTourBtn");

  // Floating contact elements
  var contactFab = document.getElementById("contactFab");
  var contactOptions = document.getElementById("contactOptions");

  // View control elements
  var viewUpElement = document.querySelector("#viewUp");
  var viewDownElement = document.querySelector("#viewDown");
  var viewLeftElement = document.querySelector("#viewLeft");
  var viewRightElement = document.querySelector("#viewRight");
  var viewInElement = document.querySelector("#viewIn");
  var viewOutElement = document.querySelector("#viewOut");

  // Modal elements
  var infoModal = document.querySelector("#infoModal");
  var modalTitle = document.querySelector("#modalTitle");
  var modalContent = document.querySelector("#modalContent");
  var modalClose = document.querySelector("#modalClose");
  var modalBackdrop = document.querySelector("#modalBackdrop");

  // State variables
  var currentScene = null;
  var sceneListOpen = false;
  var firstInteraction = true;
  var userHasInteracted = false;
  var contactOptionsOpen = false;

  // Welcome Screen Handler
  startTourBtn.addEventListener("click", function () {
    welcomeScreen.classList.add("hidden");
    setTimeout(function () {
      welcomeScreen.style.display = "none";
    }, 500);
  });

  // Floating Contact Button Handler
  contactFab.addEventListener("click", function (e) {
    e.stopPropagation();
    contactOptionsOpen = !contactOptionsOpen;
    if (contactOptionsOpen) {
      contactOptions.classList.add("active");
    } else {
      contactOptions.classList.remove("active");
    }
  });

  // Close contact options when clicking outside
  document.addEventListener("click", function (e) {
    if (!contactOptions.contains(e.target) && !contactFab.contains(e.target)) {
      contactOptions.classList.remove("active");
      contactOptionsOpen = false;
    }
  });

  // Detect desktop or mobile mode
  if (window.matchMedia) {
    var setMode = function () {
      if (mql.matches) {
        document.body.classList.remove("desktop");
        document.body.classList.add("mobile");
      } else {
        document.body.classList.remove("mobile");
        document.body.classList.add("desktop");
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add("desktop");
  }

  // Detect touch device
  document.body.classList.add("no-touch");
  window.addEventListener("touchstart", function () {
    document.body.classList.remove("no-touch");
    document.body.classList.add("touch");
  });

  // Viewer options
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode,
    },
  };

  // Initialize viewer
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // Show instruction overlay on first load
  showInstruction();

  // Create scenes
  var scenes = data.scenes.map(function (sceneData) {
    var urlPrefix = "tiles";
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + sceneData.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + sceneData.id + "/preview.jpg" }
    );
    var geometry = new Marzipano.CubeGeometry(sceneData.levels);
    var limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize,
      (100 * Math.PI) / 180,
      (120 * Math.PI) / 180
    );
    var view = new Marzipano.RectilinearView(
      sceneData.initialViewParameters,
      limiter
    );

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    // Create link hotspots with new glassmorphic design
    sceneData.linkHotspots.forEach(function (hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene
        .hotspotContainer()
        .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    // Create info hotspots
    sceneData.infoHotspots.forEach(function (hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene
        .hotspotContainer()
        .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return {
      data: sceneData,
      scene: scene,
      view: view,
    };
  });

  // Set up autorotate
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2,
  });

  // Initialize autorotate state
  var autorotateEnabled = data.settings.autorotateEnabled || false;
  updateAutorotateIcon();

  // Set up fullscreen mode
  if (screenfull.enabled && data.settings.fullscreenButton) {
    fullscreenToggleElement.addEventListener("click", function () {
      screenfull.toggle();
    });
    screenfull.on("change", function () {
      updateFullscreenIcon();
    });
  }

  // Dynamic parameters for view controls
  var velocity = 0.7;
  var friction = 3;

  // Associate view controls with elements
  var controls = viewer.controls();
  controls.registerMethod(
    "upElement",
    new Marzipano.ElementPressControlMethod(
      viewUpElement,
      "y",
      -velocity,
      friction
    ),
    true
  );
  controls.registerMethod(
    "downElement",
    new Marzipano.ElementPressControlMethod(
      viewDownElement,
      "y",
      velocity,
      friction
    ),
    true
  );
  controls.registerMethod(
    "leftElement",
    new Marzipano.ElementPressControlMethod(
      viewLeftElement,
      "x",
      -velocity,
      friction
    ),
    true
  );
  controls.registerMethod(
    "rightElement",
    new Marzipano.ElementPressControlMethod(
      viewRightElement,
      "x",
      velocity,
      friction
    ),
    true
  );
  controls.registerMethod(
    "inElement",
    new Marzipano.ElementPressControlMethod(
      viewInElement,
      "zoom",
      -velocity,
      friction
    ),
    true
  );
  controls.registerMethod(
    "outElement",
    new Marzipano.ElementPressControlMethod(
      viewOutElement,
      "zoom",
      velocity,
      friction
    ),
    true
  );

  // Event listeners
  sceneListToggleElement.addEventListener("click", toggleSceneList);
  sceneListCloseElement.addEventListener("click", hideSceneList);
  autorotateToggleElement.addEventListener("click", toggleAutorotate);
  modalClose.addEventListener("click", hideInfoModal);
  modalBackdrop.addEventListener("click", hideInfoModal);
  sceneListOverlay.addEventListener("click", hideSceneList);

  // Add interaction detection for the panorama
  setupInteractionDetection();

  // Initialize scene list
  initializeSceneList();

  // Start with the first scene
  switchScene(scenes[0]);

  // Helper functions
  function sanitize(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function setupInteractionDetection() {
    var interactionEvents = ["mousedown", "touchstart", "wheel"];

    interactionEvents.forEach(function (eventType) {
      panoElement.addEventListener(
        eventType,
        function (e) {
          if (!userHasInteracted) {
            userHasInteracted = true;
            hideInstruction();
          }
        },
        { passive: true }
      );
    });

    // Also detect view control button interactions
    var viewControlButtons = [
      viewUpElement,
      viewDownElement,
      viewLeftElement,
      viewRightElement,
      viewInElement,
      viewOutElement,
    ];
    viewControlButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (!userHasInteracted) {
          userHasInteracted = true;
          hideInstruction();
        }
      });
    });
  }

  function initializeSceneList() {
    scenesContainer.innerHTML = "";

    scenes?.forEach(function (scene, index) {
      var sceneItem = document.createElement("div");
      sceneItem.className =
        "card bg-base-300 hover:bg-base-200 cursor-pointer transition-all duration-300 transform hover:scale-105";
      sceneItem.setAttribute("data-scene-id", scene.data.id);

      sceneItem.innerHTML = `
        <div class="card-body p-4">
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="w-16 h-12 rounded-lg">
                <img src="tiles/${scene.data.id}/preview.jpg" 
                     alt="${sanitize(scene.data.name)}" 
                     class="scene-preview object-cover w-full h-full rounded-lg" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-full h-full bg-base-100 rounded-lg flex items-center justify-center" style="display: none;">
                  <i class="fas fa-image text-base-content opacity-50"></i>
                </div>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-base-content">${sanitize(
                scene.data.name
              )}</h3>
              <p class="text-sm text-base-content opacity-70">Scene ${
                index + 1
              }</p>
            </div>
            <i class="fas fa-chevron-right text-base-content opacity-50"></i>
          </div>
        </div>
      `;

      sceneItem.addEventListener("click", function () {
        switchScene(scene);
        if (
          document.body.classList.contains("mobile") ||
          window.innerWidth < 768
        ) {
          hideSceneList();
        }
      });

      scenesContainer.appendChild(sceneItem);
    });
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    currentScene = scene;

    // Add fade transition effect
    panoElement.style.opacity = "0";
    setTimeout(function () {
      panoElement.style.opacity = "1";
    }, 150);

    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    var sceneItems = scenesContainer.querySelectorAll("[data-scene-id]");
    sceneItems.forEach(function (item) {
      var itemId = item.getAttribute("data-scene-id");
      if (itemId === scene.data.id) {
        item.classList.add("ring-2", "ring-primary");
      } else {
        item.classList.remove("ring-2", "ring-primary");
      }
    });
  }

  var sceneList = document.querySelector("#sceneList");
  function showSceneList() {
    sceneListOpen = true;
    sceneList.style.display = "block";
    setTimeout(() => {
      sceneListContent.classList.remove("-translate-x-full");
      sceneListOverlay.style.opacity = "1";
    }, 10);
  }

  function hideSceneList() {
    sceneListOpen = false;
    sceneListContent.classList.add("-translate-x-full");
    sceneListOverlay.style.opacity = "0";

    setTimeout(() => {
      sceneList.style.display = "none";
    }, 300);
  }

  function toggleSceneList() {
    if (sceneListOpen) {
      hideSceneList();
    } else {
      showSceneList();
    }
  }

  function startAutorotate() {
    if (!autorotateEnabled) return;
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    autorotateEnabled = !autorotateEnabled;
    updateAutorotateIcon();

    if (autorotateEnabled) {
      startAutorotate();
    } else {
      stopAutorotate();
    }
  }

  function updateAutorotateIcon() {
    if (autorotateEnabled) {
      autorotateIcon.className = "fas fa-pause text-xl";
      autorotateToggleElement.classList.add("text-primary");
    } else {
      autorotateIcon.className = "fas fa-play text-xl";
      autorotateToggleElement.classList.remove("text-primary");
    }
  }

  function updateFullscreenIcon() {
    if (screenfull.isFullscreen) {
      fullscreenIcon.className = "fas fa-compress text-xl";
      fullscreenToggleElement.classList.add("text-primary");
    } else {
      fullscreenIcon.className = "fas fa-expand text-xl";
      fullscreenToggleElement.classList.remove("text-primary");
    }
  }

  function showInfoModal(title, content) {
    modalTitle.innerHTML = sanitize(title);
    modalContent.innerHTML = content;
    infoModal.classList.add("modal-open");
  }

  function hideInfoModal() {
    infoModal.classList.remove("modal-open");
  }

  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement("div");
    wrapper.className = "hotspot link-hotspot";

    // Get target scene name
    var targetSceneData = findSceneDataById(hotspot.target);
    var targetName = targetSceneData ? targetSceneData.name : "Next Scene";

    // Create glassmorphic container
    var container = document.createElement("div");
    container.className = "glassmorphic-hotspot";

    // Create arrow icon
    var arrowIcon = document.createElement("div");
    arrowIcon.className = "arrow-icon";

    // Determine arrow direction based on rotation
    var arrowDirection = "fa-arrow-right";
    if (hotspot.rotation) {
      var rotationDeg = (hotspot.rotation * 180) / Math.PI;
      if (rotationDeg > 315 || rotationDeg <= 45) {
        arrowDirection = "fa-arrow-right";
      } else if (rotationDeg > 45 && rotationDeg <= 135) {
        arrowDirection = "fa-arrow-down";
      } else if (rotationDeg > 135 && rotationDeg <= 225) {
        arrowDirection = "fa-arrow-left";
      } else {
        arrowDirection = "fa-arrow-up";
      }
    }

    arrowIcon.innerHTML = '<i class="fas ' + arrowDirection + '"></i>';

    // Create text label
    var textLabel = document.createElement("div");
    textLabel.className = "hotspot-text";
    textLabel.textContent = "Go to " + targetName;

    container.appendChild(arrowIcon);
    container.appendChild(textLabel);

    // Add click handler
    container.addEventListener("click", function (e) {
      e.stopPropagation();
      var targetScene = findSceneById(hotspot.target);
      if (targetScene) {
        switchScene(targetScene);
      }
    });

    wrapper.appendChild(container);

    // Prevent event propagation
    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement("div");
    wrapper.className = "hotspot info-hotspot";

    // Create the info button
    var button = document.createElement("button");
    button.className =
      "btn btn-info btn-circle btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110";
    button.innerHTML = '<i class="fas fa-info text-lg"></i>';

    // Add click handler to show modal
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      showInfoModal(
        hotspot.title || "Information",
        hotspot.text || "No information available."
      );
    });

    // Add tooltip
    var tooltip = document.createElement("div");
    tooltip.className = "tooltip tooltip-top";
    tooltip.setAttribute("data-tip", hotspot.title || "More Info");
    tooltip.appendChild(button);

    wrapper.appendChild(tooltip);

    // Prevent event propagation
    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  function stopTouchAndScrollEventPropagation(element) {
    var eventList = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
      "wheel",
      "mousewheel",
    ];
    eventList.forEach(function (eventName) {
      element.addEventListener(eventName, function (event) {
        event.stopPropagation();
      });
    });
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // Instructions animation functions
  function showInstruction() {
    instructionOverlay.style.display = "flex";
    instructionOverlay.style.opacity = "1";
  }

  function hideInstruction() {
    instructionOverlay.style.opacity = "0";
    setTimeout(() => {
      instructionOverlay.style.display = "none";
    }, 500);
  }

  // Add event listener for manual close button only
  closeInstruction.addEventListener("click", function () {
    userHasInteracted = true;
    hideInstruction();
  });

  // Initialize on desktop
  if (!document.body.classList.contains("mobile") && window.innerWidth >= 768) {
    setTimeout(() => {
      showSceneList();
    }, 1000);
  } else {
    sceneListContent.classList.add("-translate-x-full");
  }
})();
