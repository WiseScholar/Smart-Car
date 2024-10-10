document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const pushButton = document.getElementById('push-button');
    const gearButtons = document.querySelectorAll('.gear-btn');
    const accelerateButton = document.getElementById('accelerate');
    const brakeButton = document.getElementById('brake');
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');
    const engineStatus = document.getElementById('engine-status');
    const currentGearDisplay = document.getElementById('current-gear');
    const currentSpeedDisplay = document.getElementById('current-speed');

    let engineOn = false;
    let currentGear = 0;
    let currentSpeed = 0;

    // Helper function to send commands to ESP32
    function sendCommand(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => console.log('Success:', data))
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error with the command. Please try again.');
            });
    }

    // Toggle car power
    pushButton.addEventListener('click', () => {
        engineOn = !engineOn;
        engineStatus.textContent = engineOn ? 'Engine Status: ON' : 'Engine Status: OFF';
        engineStatus.className = engineOn ? 'engine-on' : 'engine-off';
        sendCommand(`/power?state=${engineOn ? 'on' : 'off'}`);
    });

    // Gear shifting
    gearButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gear = button.id === 'P' ? 0 : button.id === 'R' ? 1 : button.id === 'N' ? 2 : parseInt(button.id) + 2;
            currentGear = gear;
            currentGearDisplay.textContent = button.id;
            sendCommand(`/gear?gear=${gear}`);
        });
    });

    // Accelerate
    accelerateButton.addEventListener('click', () => {
        if (currentGear >= 3 && currentGear <= 7) {
            currentSpeed += 10;
            currentSpeed = Math.min(currentSpeed, 255); // Limit speed
            currentSpeedDisplay.textContent = currentSpeed;
            sendCommand('/speed?direction=up');
        }
    });

    // Brake
    brakeButton.addEventListener('click', () => {
        if (currentGear >= 3 && currentGear <= 7) {
            currentSpeed -= 10;
            currentSpeed = Math.max(currentSpeed, 51); // Minimum speed in Drive
            currentSpeedDisplay.textContent = currentSpeed;
            sendCommand('/speed?direction=down');
        }
    });

    // Turning left
    leftButton.addEventListener('click', () => {
        sendCommand('/turn?direction=left');
    });

    // Turning right
    rightButton.addEventListener('click', () => {
        sendCommand('/turn?direction=right');
    });
});
