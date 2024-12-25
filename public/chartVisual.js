//import Chart from 'chart.js/auto';

// fetch chart data from the server
async function fetchChartData() {
    const response = await fetch('/api/chart-data');
    if (!response.ok) {
        console.error('Failed to fetch chart data');
        return null;
    }
    return response.json();
}

// create a chart
function createChart(ctx, type, data, options) {
    return new Chart(ctx, {
        type,
        data,
        options,
    });
}

// visualize metrics
async function visualizeMetrics() {
    const metricsData = await fetchChartData();

    if (!metricsData) return;

    // Extract domains, accuracy rates, and average response times
    const domains = Object.keys(metricsData);
    const accuracyRates = domains.map(domain => metricsData[domain].accuracyRate);
    const averageTimes = domains.map(domain => metricsData[domain].averageResponseTime);

    // Accuracy Chart
    const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');
    createChart(accuracyCtx, 'bar', {
        labels: ['Histoty','Social','Computer'],
        datasets: [
            {
                label: 'Accuracy Rate (%)',
                data: accuracyRates,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    // Response Time Chart
    const responseTimeCtx = document.getElementById('responseTimeChart').getContext('2d');
    // createChart(responseTimeCtx, 'line', {
    //     labels: domains,
    //     datasets: [
    //         {
    //             label: 'Average Response Time (ms)',
    //             data: averageTimes,
    //             backgroundColor: 'rgba(153, 102, 255, 0.2)',
    //             borderColor: 'rgba(153, 102, 255, 1)',
    //             borderWidth: 1,
    //         },
    //     ],
    // });
    createChart(responseTimeCtx, 'bar', {
        labels: ['Histoty','Social','Computer'],
        datasets: [
            {
                label: 'Response Time (ms)',
                data: averageTimes,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });
}

// Execute when the DOM is loaded
document.addEventListener('DOMContentLoaded', visualizeMetrics);
