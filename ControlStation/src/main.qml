import QtQuick 2.15
import QtQuick.Controls 2.15
import QtCharts 2.15

ApplicationWindow {
    visible: true
    width: 800
    height: 600
    title: "QuakeSense"

    // Sidebar with a dropdown for serial ports and a connect button
    Rectangle {
        width: 200
        height: parent.height
        color: "#2c3e50"

        // Title
        Text {
            text: "Control Panel"
            color: "white"
            font.bold: true
            anchors.top: parent.top
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.topMargin: 20
        }

        // Serial port dropdown
        ComboBox {
            id: portComboBox
            anchors.top: parent.top
            anchors.topMargin: 60
            anchors.left: parent.left
            width: parent.width - 40
            model: serialPortHandler.ports
            currentIndex: -1  // Default to no selection

            onCurrentIndexChanged: {
                // Handle port selection
                console.log("Selected Port: " + portComboBox.currentText)
            }
        }

        // Connect button
        Button {
            text: "Connect"
            anchors.top: portComboBox.bottom
            anchors.topMargin: 20
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                serialPortHandler.connect_to_port(portComboBox.currentText)
            }
        }

        // Connection status text
        Text {
            id: connectionStatus
            text: "Disconnected"
            color: "white"
            anchors.top: parent.top
            anchors.topMargin: 150
            anchors.horizontalCenter: parent.horizontalCenter
            font.pixelSize: 18
        }

        // Update connection status
        Connections {
            target: serialPortHandler
            onConnectionStatusSignal: {
                connectionStatus.text = message
            }
        }
    }

    // Main content: Chart to display ADC readings
    ChartView {
        id: chartView
        width: parent.width - 200
        height: parent.height
        anchors.right: parent.right
        title: "ADC Readings"

        LineSeries {
            id: adcSeries
            name: "ADC Readings"
            axisX: ValueAxis {
                min: 0
                max: 100
                tickCount: 6
            }
            axisY: ValueAxis {
                min: 0
                max: 4096
                tickCount: 9
            }

            Component.onCompleted: {
                adcSeries.append(0, 0)
            }
        }

        Connections {
            target: adcHandler
            onAdcValueSignal: {
                adcSeries.append(adcSeries.count, adc_value)
                if (adcSeries.count > 100) {
                    chartView.scroll(10, 0)
                }
            }
        }
    }
}
