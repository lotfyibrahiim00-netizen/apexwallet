package com.apexwallet.app;

import android.os.Bundle;
import com.apexwallet.app.sms.BankSmsPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BankSmsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
