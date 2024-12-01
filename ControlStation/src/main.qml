import QtQuick 2.15
import QtQuick.Controls 6.0
import QtQuick.Controls.Material 2.12
import QtCharts 2.0

ApplicationWindow {
    visible: true
    width: 800
    height: 600
    title: "QuakeSense"
    Material.theme: Material.Light

    // Background Color
    Rectangle
    {
        anchors.fill: parent
        color: "#ffffff"  // Darker background color for the main window
    }

    // Sidebar with a dropdown for serial ports and a connect button
    Rectangle {
        width: 200
        height: parent.height
        color: "#34495e"  // Slightly lighter shade for sidebar

        // Title
        Text
        {
            text: "Control Panel"
            color: "white"
            font.bold: true
            anchors.top: parent.top
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.topMargin: 20
            font.pointSize: 18
        }

        // ComboBox for serial ports
        ComboBox
        {
            id: comboBox
            width: parent.width - 20
            height: 40
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.topMargin: 80
            anchors.leftMargin: 10

            background: Rectangle {
                color: "#ffffff"
                radius: 5
            }

            model: ListModel {}

            delegate: Item {
                width: parent.width
                height: 25

                Rectangle {
                    width: parent.width
                    height: parent.height
                    color: comboBox.highlightedIndex === index ? "#ecf0f1" : "transparent"
                    radius: 5

                    MouseArea {
                        id: mouseArea
                        anchors.fill: parent
                        onClicked: {
                            comboBox.currentIndex = index
                            comboBox.popup.close()
                        }
                    }

                    Text {
                        anchors.centerIn: parent
                        text: model.name
                        font.pointSize: parent.height - 10
                        color: "#34495e"
                    }
                }
            }

            contentItem: Rectangle {
                width: parent.width
                height: parent.height
                anchors.centerIn: parent
                color: Qt.rgba(0, 0, 0, 0)

                Text {
                    anchors.centerIn: parent
                    text: comboBox.currentText
                    font.pointSize: parent.height - 25
                    color: "#2c3e50"
                }
            }
        }

        // Connect button for initiating connection
        Button
        {
            text: "Connect"
            width: parent.width - 20
            height: 40
            anchors.top: comboBox.bottom
            anchors.left: parent.left
            anchors.topMargin: 20
            anchors.leftMargin: 10
            onClicked: {
                mavlinkHandler.start_listening(comboBox.currentText, 115200)
            }

            background: Rectangle {
                color: "#2980b9"  // Material Blue color
                radius: 5
            }

            contentItem: Text {
                anchors.centerIn: parent
                text: "Connect"
                color: "white"
                font.bold: true
            }
        }

        // Connections to listen to the availablePortsSignal
        Connections
        {
            target: serialPortHandler
            function onAvailablePortsSignal(availablePorts)
            {
                console.log("Available ports:", availablePorts)
                comboBox.model.clear()
                // Update the model with the available ports
                for (let i = 0; i < availablePorts.length; i++) {
                    comboBox.model.append({name: availablePorts[i]})
                }
            }
        }

        Connections {
            target: mavlinkHandler
            function onAdc_value_signal(adc_value)
            {
                console.log("Received ADC value:", adc_value)
                chartUpdater.updateChart(adc_value)
            }
        }

        // Initial action to list serial ports
        Component.onCompleted: {
            serialPortHandler.list_serial_ports()
        }
    }

    // ChartView for displaying ADC values
    ChartView {
        id: chartView
        width: parent.width - 220 // Adjust width to fit inside the sidebar
        height: parent.height
        anchors.top: parent.top
        anchors.right: parent.right

        // Line series to plot ADC values
        LineSeries {
            id: adcSeries
            name: "ADC Values"
            color: "#2980b9"
            axisX: ValueAxis {
                id: axisX
                min: 0
                max: 100 // Adjust as needed based on the number of points you plan to show
                tickCount: 100
            }
            axisY: ValueAxis {
                id: axisY
                min: 0
                max: 1024 // Initial range for ADC values
                tickCount: 10
            }
        }
    }

    // Helper object to update the chart dynamically
    QtObject {
        id: chartUpdater

        // Store the number of points on the chart
        property int pointCount: 0

            // Store the min and max ADC values
            property int minValue: 1024
                property int maxValue: 0

                    // Store the range of the X-axis
                    property int xRange: 1000

                        // Function to update the chart with the new ADC value
                        function updateChart(adc_value)
                        {
                            // Append the ADC value to the series
                            adcSeries.append(pointCount, adc_value)

                            // Increment the point counter
                            pointCount++

                            // Update min and max ADC values
                            if (adc_value < minValue)
                            {
                                minValue = adc_value
                            }
                            if (adc_value > maxValue)
                            {
                                maxValue = adc_value
                            }

                            // Dynamically update the Y-axis range
                            axisY.min = minValue - 10
                            axisY.max = maxValue + 10

                            // Dynamically update the X-axis range
                            if (pointCount > xRange)
                            {
                                // Shift the chart to the left
                                axisX.min = pointCount - xRange
                                axisX.max = pointCount
                            } else {
                            // Ensure the X-axis starts at 0 if not enough points
                            axisX.min = 0
                            axisX.max = xRange
                        }
                    }
                }
            }
