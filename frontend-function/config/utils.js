function serverlessBehaviour() {
  return new Promise((resolve) => {
    // Simulate random latency between 0 and 4000 ms
    const simulatedLatency = Math.random() * 4000; // Between 0 and 4000 ms

    setTimeout(() => {
      resolve({
        message: "Simulated Cold Start",
        time: `${simulatedLatency.toFixed(2)} ms`,
      });
    }, simulatedLatency);
  });
}

module.exports = { serverlessBehaviour };
