var APP_DATA = {
  "scenes": [
    {
      "id": "0-living-room",
      "name": "Living Room",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1000,
      "initialViewParameters": {
        "yaw": 2.3334242689476294,
        "pitch": 0.00282967286568514,
        "fov": 1.2988261968502064
      },
      "linkHotspots": [
        {
          "yaw": 1.8730060209867805,
          "pitch": 0.06454632757784928,
          "rotation": 0.7853981633974483,
          "target": "1-corridor"
        },
        {
          "yaw": 0.07942997306685307,
          "pitch": 0.01475638347826802,
          "rotation": 0,
          "target": "5-compound"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-corridor",
      "name": "Corridor",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 1.8327212680186085,
          "pitch": 0.12539403678970018,
          "rotation": 5.497787143782138,
          "target": "2-toilet"
        },
        {
          "yaw": 2.2815926858562197,
          "pitch": 0.22645790108431285,
          "rotation": 0.7853981633974483,
          "target": "0-living-room"
        },
        {
          "yaw": 0.8405729531186008,
          "pitch": 0.08218446065226104,
          "rotation": 11.780972450961727,
          "target": "3-bedroom"
        },
        {
          "yaw": -0.4953535178685158,
          "pitch": 0.04540446819316024,
          "rotation": 0.7853981633974483,
          "target": "3-bedroom"
        },
        {
          "yaw": -1.942951255631236,
          "pitch": 0.13082280669066293,
          "rotation": 0,
          "target": "4-kitchen"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-toilet",
      "name": "Toilet",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1000,
      "initialViewParameters": {
        "yaw": 0.7677164431216212,
        "pitch": -0.12857491035378388,
        "fov": 1.2988261968502064
      },
      "linkHotspots": [
        {
          "yaw": -2.1935722522413776,
          "pitch": 0.13651101210131422,
          "rotation": 0.7853981633974483,
          "target": "1-corridor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-bedroom",
      "name": "Bedroom",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -2.266831462984559,
          "pitch": 0.27028554575288233,
          "rotation": 5.497787143782138,
          "target": "1-corridor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "4-kitchen",
      "name": "kitchen",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -2.2779363895146805,
          "pitch": 0.11384081678384561,
          "rotation": 5.497787143782138,
          "target": "1-corridor"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "5-compound",
      "name": "Compound",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -1.393093848803959,
          "pitch": 0.24887272149626227,
          "rotation": 0,
          "target": "0-living-room"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "project1",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": false
  }
};
