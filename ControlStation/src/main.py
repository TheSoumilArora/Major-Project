import sys
import os

from SerialPortHandler import SerialPortHandler
from MAVLinkHandler import MAVLinkHandler

from PySide6.QtCore import QObject, Signal, QTimer
from PySide6.QtQml import QQmlApplicationEngine
from PySide6.QtWidgets import QApplication


def main():
    app = QApplication(sys.argv)

    # Create an instance of SerialPortHandler
    serial_port_handler = SerialPortHandler()
    mavlink_handler = MAVLinkHandler()

    # Start the QML engine
    engine = QQmlApplicationEngine()

    # Set context properties for QML
    engine.rootContext().setContextProperty("serialPortHandler", serial_port_handler)
    engine.rootContext().setContextProperty("mavlinkHandler", mavlink_handler)

    # Load the QML UI
    script_dir = os.path.dirname(os.path.abspath(__file__))
    engine.load(os.path.join(script_dir, "main.qml"))

    if not engine.rootObjects():
        sys.exit(-1)

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
