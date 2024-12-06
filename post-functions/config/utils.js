let lastRequestTime = Date.now();
let coldStartTimeout;

function serverlessBehaviour() {
    return new Promise((resolve) => {
        // Simulate the cold start behavior after 5 minutes of inactivity
        // const inactivityThreshold = 5 * 60 * 1000; // 5 minutes
        const inactivityThreshold = 10 *  1000; // 5 minutes


        const currentTime = Date.now();
        const timeSinceLastRequest = currentTime - lastRequestTime;
      
        // Clear any existing cold start timeout
        clearTimeout(coldStartTimeout);

        if (timeSinceLastRequest >= inactivityThreshold) {
            // Cold start simulation after 5 minutes of inactivity
            const simulatedLatency = Math.random() * 4000; // Between 0 and 4000 ms for cold start
            coldStartTimeout = setTimeout(() => {
                resolve({
                    message: "Simulated Cold Start",
                    time: `${simulatedLatency.toFixed(2)} ms`,
                });
            }, simulatedLatency);
            console.log("function cold");

        } else {
            // Warm start, no delay if the function is still warm
            resolve({
                message: "Simulated Warm Start (No Delay)",
                time: "0 ms",
            });
            console.log("function warm");
            
        }

        // Update the last request time to now
        lastRequestTime = currentTime;
    });
}

module.exports = {serverlessBehaviour};
