package org.zanata.webtrans.shared.rpc;

import java.util.ArrayList;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.zanata.webtrans.shared.model.GlossaryResultItem;

public class GetGlossaryResult implements DispatchResult {

    private static final long serialVersionUID = 1L;

    @SuppressFBWarnings(value = "SE_BAD_FIELD")
    private ArrayList<GlossaryResultItem> glossaries;
    private GetGlossary request;

    @SuppressWarnings("unused")
    private GetGlossaryResult() {
    }

    public GetGlossaryResult(GetGlossary request,
            ArrayList<GlossaryResultItem> glossaries) {
        this.glossaries = glossaries;
        this.request = request;
    }

    public ArrayList<GlossaryResultItem> getGlossaries() {
        return glossaries;
    }

    public void setGlossaries(ArrayList<GlossaryResultItem> glossaries) {
        this.glossaries = glossaries;
    }

    public GetGlossary getRequest() {
        return request;
    }
}
