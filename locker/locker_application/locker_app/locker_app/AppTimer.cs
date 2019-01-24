using System;
using System.Timers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace locker_app
{
    class AppTimer
    {

        private static System.Timers.Timer aTimer;
        private int milsec;

        public AppTimer(int seconds)
        {
            milsec = seconds * 1000;
            SetTimer(milsec);
        }

        private static void SetTimer(int milsec)
        {
            // Create a timer with a two second interval.
            aTimer = new System.Timers.Timer(milsec);
            // Hook up the Elapsed event for the timer. 
            aTimer.Elapsed += OnTimedEvent;
            aTimer.Enabled = true;
        }

        private static void OnTimedEvent(Object source, ElapsedEventArgs e)
        {
            Application.Restart();
        }
    }
}
